import { db } from "..";
import { stockItem, stocks } from "../schema";
import { eq } from "drizzle-orm";

interface AddItemToLocation {
    locationId: number;
    itemId: number;
    quantity: number;
    unit: string;
}

export async function addItemToLocation(data: AddItemToLocation) {
    const locationStockRow = await db
        .select({
            id: stocks.id
        })
        .from(stocks)
        .where(eq(stocks.locationId, data.locationId));
    
    if (locationStockRow.length === 0) {
        return false;
    }

    const locationStock = locationStockRow[0];

    await db
        .insert(stockItem)
        .values({
            stockId: locationStock.id,
            itemId: data.itemId,
            quantity: data.quantity,
            unit: data.unit
        });
    
    return true;
}