import { db } from "$lib/server/db";
import { createItem, updateItem } from "$lib/server/db/queries/item";
import { item } from "$lib/server/db/schema";
import { fail, type Actions } from "@sveltejs/kit";
import { and, eq, ilike } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import type { Property } from "$lib/ui/types/Item";


export const load: PageServerLoad = async ({depends, url}) => {
    depends('data:items');

    const searchQuery = url.searchParams.getAll('q') || '';
    const conditions = searchQuery.map(word => ilike(item.name, `%${word}%`));

    const rawItems = await db.query.item.findMany({
        columns: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            location: true
        },
        where: conditions.length > 0 ? and(...conditions) : undefined,
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
            },
            stockItems: {
                with: {
                    stock: {
                        with: {
                            location: {
                                columns: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    const items = rawItems.map(({ itemProperties, itemItemCategories, stockItems, ...item }) => ({
        ...item,
        properties: [
            ...itemProperties
        ],
        categories: itemItemCategories.map((iic) => iic.itemCategory.name),
        locations: stockItems.map(({stock}) => stock.location).filter(l => l !== null).map(l => ({
            id: l.id,
            name: l.name
        }))
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
        const properties = JSON.parse(itemData.get("properties") as string) as Property[];

        await createItem({
            name,
            description,
            categories,
            properties
        })
    },

    delete: async ({ request }) => {
        const itemData = await request.formData();

        if (!itemData.get("id")) {
            return fail(403, {
                missing: true,
                message: "No ID provided"
            });
        }

        const itemId = parseInt(itemData.get("id") as string);

        await db.delete(item)
            .where(eq(item.id, itemId));
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

        await updateItem({
            id: itemId,
            name,
            description,
            categories,
            properties
        });
    }
}