import { db } from '$lib/server/db';
import { item, location, stockItem, stocks } from '$lib/server/db/schema';
import { and, eq, ilike, inArray } from 'drizzle-orm';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { updateItem } from '$lib/server/db/queries/item';
import type { Property } from '$lib/ui/types/Item';

export const load: PageServerLoad = async ({ params, depends, url }) => {
    depends("location:data:items")

    const searchQuery = url.searchParams.getAll('q') || '';
    const conditions = searchQuery.map(word => ilike(item.name, `%${word}%`));

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
    const locationStockItemsRows = await db.select({
        itemId: stockItem.itemId,
        quantity: stockItem.quantity,
        unit: stockItem.unit
    })
        .from(stockItem)
        .where(eq(stockItem.stockId, locationStock.id));

    // No Items
    if (locationStockItemsRows.length === 0) {
        return { locationData }
    }

    const locationStockItemsIds = locationStockItemsRows.map((l) => l.itemId);

    const rawItems = await db.query.item.findMany({
        columns: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
        },
        where: and(
            ...conditions,
            inArray(item.id, locationStockItemsIds)
        ),
        orderBy: (item, {desc}) => desc(item.createdAt),
        with: {
            stockItems: {
                columns: {
                    quantity: true,
                    unit: true
                },
                where: eq(stockItem.stockId, locationStock.id)
            },

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

    const items = rawItems.map(({ itemProperties, itemItemCategories, stockItems, ...item }) => ({
        ...item,
        properties: [
            ...itemProperties
        ],
        categories: itemItemCategories.map((iic) => iic.itemCategory.name),
        quantity: stockItems?.[0].quantity,
        unit: stockItems?.[0].unit
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
    },
    
    removeItem: async ({request}) => {
        const data = await request.formData();

        if (!data.get("itemId") || !data.get("locationId")) {
            return fail(403);
        }

        const itemId = parseInt(data.get("itemId") as string);
        const locationId = parseInt(data.get("locationId") as string);

        let _fail = null
        await db.transaction(async (tx) => {
            const _stocks = await tx.select({
                id: stocks.id
            })
                .from(stocks)
                .where(eq(stocks.locationId, locationId));

            if (_stocks.length < 0) {
                _fail = fail(404);
                return;
            }

            const stock = _stocks[0];

            await tx
                .delete(stockItem)
                .where(
                    and(
                        eq(stockItem.stockId, stock.id),
                        eq(stockItem.itemId, itemId)
                    )
                )
        });

        if (_fail) {
            return _fail;
        }
    },

    updateItemQuantity: async ({request}) => {
        const data = await request.formData();

        const itemId = parseInt(data.get("itemId") as string);
        const locationId = parseInt(data.get("locationId") as string);
        const quantity = parseInt(data.get("quantity") as string);
        const unit = data.get("unit") as string;

        const stockRow = await db.select()
            .from(stocks)
            .where(eq(stocks.locationId, locationId));

        if (stockRow.length === 0) {
            return fail(404, {
                message: `Item not at this location id (${locationId})`
            });
        }

        const stock = stockRow[0];
        await db.update(stockItem)
            .set({
                quantity,
                unit
            })
            .where(
                and(
                    eq(stockItem.itemId, itemId),
                    eq(stockItem.stockId, stock.id),
                )
            )
    }
}