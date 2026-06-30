import { db } from "$lib/server/db";
import { item, itemCategory, itemItemCategory, itemProperty } from "$lib/server/db/schema";
import { fail, type Actions } from "@sveltejs/kit";

export async function load() {
    const rawItems = await db.query.item.findMany({
        columns: {
            id: true,
            name: true,
            description: true,
            createdAt: true
        },
        orderBy: (item, {desc}) => desc(item.createdAt),
        with: {
            itemProperties: {
                columns: {
                    id: true,
                    name: true,
                    value: true
                }
            },
            itemItemCategories: {
                with: {
                    itemCategory: true
                }
            }
        }
    })

    const items = rawItems.map(({ itemProperties, itemItemCategories, ...item }) => ({
        ...item,
        properties: [
            ...itemProperties
        ],
        categories: itemItemCategories.map((iic) => iic.itemCategory.name)
    }));

    return {
        items
    };
}

export const actions: Actions = {
    create: async ({request}) => {
        const itemData = await request.formData();

        if (!itemData.get("name")) {
            return fail(403, {
                message: "No name provided"
            });
        }

        const name = itemData.get("name") as string;
        const description = itemData.get("description") as string;
        const categories = (itemData.get("categories") as string).split(",");
        const properties = JSON.parse(itemData.get("properties") as string);

        await db.transaction(async (tx) => {
            const [newItem] = await tx.insert(item)
                .values({
                    name,
                    description
                })
                .returning({
                    id: item.id
                });

                for (let category of categories) {
                    if (category.trim().length === 0) {
                        continue;
                    }

                    category = category.trim();

                    const [newCategory] = await tx.insert(itemCategory)
                        .values({
                            name: category
                        })
                        .onConflictDoUpdate({
                            target: itemCategory.name,
                            set: { name: category }
                        })
                        .returning({
                            id: itemCategory.id
                        });

                    await tx.insert(itemItemCategory).values({
                        itemId: newItem.id,
                        itemCategoryId: newCategory.id,
                    });
                }

                for (const property of properties) {
                    await tx.insert(itemProperty).values({
                        itemId: newItem.id,
                        name: property.name,
                        value: property.value,
                        typeName: "str"
                    });
                }
        });
    }
}