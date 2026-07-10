import { db } from "$lib/server/db";
import { getItems } from "$lib/server/db/queries/item";
import { item, stockItem, stocks } from "$lib/server/db/schema";
import { json, type RequestHandler } from "@sveltejs/kit";
import { eq, notInArray } from "drizzle-orm";

export const GET: RequestHandler = async ({url}) => {
    const conditions = [];

    const barcode = url.searchParams.get("barcode");
    if (barcode) {
        conditions.push(
            eq(item.barcode, barcode)
        );
    }

    const excludeLocationId = url.searchParams.get("exclude_location");
    if (excludeLocationId) {
        const excludedItemIds = db
            .select({ itemId: stockItem.itemId })
            .from(stockItem)
            .innerJoin(stocks, eq(stockItem.stockId, stocks.id))
            .where(eq(stocks.locationId, parseInt(excludeLocationId)));
        
        conditions.push(notInArray(item.id, excludedItemIds));
    }

    const itemsRows = await getItems(conditions);

    return json(itemsRows);
}