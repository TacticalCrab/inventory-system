import { db } from "$lib/server/db";
import { updateItemCategoriesByNames, updateItemPropertiesByIds, type Property } from "$lib/server/db/queries/item";
import { item, itemCategory, itemItemCategory, itemProperty } from "$lib/server/db/schema";
import { fail, type Actions } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

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
                missing: true,
                message: "No name provided"
            });
        }
        const name = itemData.get("name") as string;
        const description = itemData.get("description") as string;
        const categories = (itemData.get("categories") as string).split(",");
        const properties = JSON.parse(itemData.get("properties") as string) as Record<string, string>[];

        await db.transaction(async (tx) => {
            const [newItem] = await tx.insert(item)
                .values({
                    name,
                    description
                })
                .returning({
                    id: item.id
                });

                await Promise.all(categories.map(async (category) => {
                    if (category.trim().length === 0) {
                        return;
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
                }));

                await Promise.all(properties.map((property: Record<string, string>) => {
                    return tx.insert(itemProperty).values({
                        itemId: newItem.id,
                        name: property.name,
                        value: property.value,
                        typeName: "str"
                    });
                }))
        });
    },

    update: async ({request}) => {
        const itemData = await request.formData();

        if (!itemData.get("id")) {
            return fail(403, {
                missing: true,
                message: "No ID provided"
            });
        }

        const itemId = parseInt(itemData.get("id") as string);
        const name = itemData.get("name") as string;
        const description = itemData.get("description") as string;
        const categories = (itemData.get("categories") as string).split(",").filter((c) => c.trim().length > 0);
        const properties = JSON.parse(itemData.get("properties") as string) as Property[];

        await db.transaction(async (tx) => {
            await tx.update(item)
                .set({
                    name,
                    description
                })
                .where(eq(item.id, itemId));

                await updateItemCategoriesByNames(tx, itemId, categories);
                await updateItemPropertiesByIds(tx, itemId, properties);
        });
    }
}