import { json, type RequestEvent } from '@sveltejs/kit';
import { ilike } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { itemCategory } from '$lib/server/db/schema';

export async function GET({ url }: RequestEvent) {
    const query = url.searchParams.get('search') || '';

    if (query.length < 2) {
        return json([]);
    }

    const results = await db
        .select({
            name: itemCategory.name
        })
        .from(itemCategory)
        .where(ilike(itemCategory.name, `${query}%`))
        .limit(10);

    return json(results.map((r) => r.name));
}