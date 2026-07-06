import { db } from "$lib/server/db";
import { location, stockItem, stocks } from "$lib/server/db/schema";
import { count, eq } from "drizzle-orm";
 
export const load = async () => {
    const locations = await db
        .select({
            id: location.id,
            name: location.name,
            description: location.description,
            itemCount: count(stockItem.itemId)
        })
        .from(location)
        .leftJoin(stocks, eq(stocks.locationId, location.id))
        .leftJoin(stockItem, eq(stockItem.stockId, stocks.id))
        .groupBy(location.id, location.name, location.description);


    return {
        locations:  locations.map((l) => ({
                id: l.id,
                name: l.name,
                description: l.description,
                itemCount: l.itemCount
        }))
    } 
}