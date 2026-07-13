import { db } from "$lib/server/db";
import { stockItem, stocks } from "$lib/server/db/schema";
import { json, type RequestHandler } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm";

export const DELETE: RequestHandler = async ({params}) => {
    const locationId = params.locationId;
    const itemId = params.itemId;

    if (!locationId || !itemId) {
        return json({ status: 403 });
    }

    let status = 200;
    await db.transaction(async (tx) => {
        const _stocks = await tx.select({
            id: stocks.id
        })
            .from(stocks)
            .where(eq(stocks.locationId, parseInt(locationId)));

        if (_stocks.length < 0) {
            status = 404;
            return;
        }

        const stock = _stocks[0];

        await tx
            .delete(stockItem)
            .where(
                and(
                    eq(stockItem.stockId, stock.id),
                    eq(stockItem.itemId, parseInt(itemId))
                )
            )
    });

    return json({ status })
}