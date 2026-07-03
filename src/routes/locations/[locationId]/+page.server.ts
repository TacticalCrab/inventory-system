import { db } from '$lib/server/db';
import { item, location, stockItem, stocks } from '$lib/server/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { updateItem } from '$lib/server/db/queries/item';
import type { Property } from '$lib/ui/types/Item';

export const load: PageServerLoad = async ({ params }) => {
    const locationsDataRaw = await db.select()
        .from(location)
        .where(eq(location.id, parseInt(params.locationId)));

    if (locationsDataRaw.length === 0) {
        return fail(404);
    }

    const locationDataRaw = locationsDataRaw[0];
    const locationData = {
        id: locationDataRaw.id,
        name: locationDataRaw.name,
        description: locationDataRaw.description
    };

    const locationStocks = await db
        .select({
            id: stocks.id
        })
        .from(stocks)
        .where(eq(stocks.locationId, locationData.id));
    
    // No stocks
    if (locationStocks.length === 0) {
        return { locationData }
    }

    const locationStock = locationStocks[0];
    const locationStockItemsRawIds = await db.select({
        itemId: stockItem.itemId
    })
        .from(stockItem)
        .where(eq(stockItem.stockId, locationStock.id));

    // No Items
    if (locationStockItemsRawIds.length === 0) {
        return { locationData }
    }

    const locationStockItemsIds = locationStockItemsRawIds.map((l) => l.itemId);

    const rawItems = await db.query.item.findMany({
        columns: {
            id: true,
            name: true,
            description: true,
            createdAt: true
        },
        where: inArray(item.id, locationStockItemsIds),
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
        locationData,
        items
    };
};

export const actions: Actions = {
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