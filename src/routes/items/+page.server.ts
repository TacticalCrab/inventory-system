import { db } from "$lib/server/db";

export async function load() {
    const rawItems = await db.query.item.findMany({
        orderBy: (item, {asc}) => asc(item.createdAt),
        with: {
            itemProperties: true,
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