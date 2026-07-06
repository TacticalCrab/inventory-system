import { db } from "$lib/server/db";
import { createItem, getItem, getItems, updateItem } from "$lib/server/db/queries/item";
import { item, stockItem, stocks } from "$lib/server/db/schema";
import { fail, type Actions } from "@sveltejs/kit";
import { eq, ilike } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import type { Property } from "$lib/ui/types/Item";


export const load: PageServerLoad = async ({depends, url}) => {
    depends('data:items');

    const searchQuery = url.searchParams.getAll('q') || '';
    const conditions = searchQuery.map(word => ilike(item.name, `%${word}%`));

    const items = await getItems(conditions);

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

    copy: async ({request}) => {
        const data = await request.formData();
        const itemId = parseInt(data.get("id") as string);

        const item = await getItem(itemId);
        if (!item) {
            return fail(404);
        }

        await createItem({
            name: item.name,
            description: item.description,
            categories: item.categories,
            properties: item.properties,
        });
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
    },

    addToLocation: async ({request}) => {
        const data = await request.formData();

        const itemId = parseInt(data.get("itemId") as string);
        const locationId = parseInt(data.get("locationId") as string);
        const quantity = parseFloat(data.get("quantity") as string);

        const locationStockRow = await db
            .select({
                id: stocks.id
            })
            .from(stocks)
            .where(eq(stocks.locationId, locationId));
        
        if (locationStockRow.length === 0) {
            return fail(404);
        }

        const locationStock = locationStockRow[0];

        await db
            .insert(stockItem)
            .values({
                stockId: locationStock.id,
                itemId,
                quantity: quantity,
                unit: "q"
            });
    }
}