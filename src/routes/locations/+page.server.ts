import { db } from "$lib/server/db";
import { location } from "$lib/server/db/schema";
 
export const load = async () => {
    const locations = await db
        .select()
        .from(location);

    return {
        locations:  locations.map((l) => ({
                id: l.id,
                name: l.name,
                description: l.description,
        }))
    } 
}