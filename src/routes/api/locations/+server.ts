import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { location, stockItem, stocks } from '$lib/server/db/schema';
import { eq, notInArray } from 'drizzle-orm';

export const GET: RequestHandler = async ({url}) => {
    let query;
    
    if (url.searchParams.get("exclude_item")) {
        const itemId = parseInt(url.searchParams.get("exclude_item") as string);
        
        query = db.select()
                .from(location)
                .where(
                    notInArray(
                    location.id,
                    db
                        .select({
                        id: location.id,
                        })
                        .from(location)
                        .leftJoin(stocks, eq(stocks.locationId, location.id))
                        .leftJoin(stockItem, eq(stockItem.stockId, stocks.id))
                        .where(eq(stockItem.itemId, itemId)),
                    ),
                );
    } else {
        query = db.select()
                .from(location);
    }
    
    const results = await query;

    return json(results.map((r) => ({
        id: r.id,
        name: r.name
    })));
}