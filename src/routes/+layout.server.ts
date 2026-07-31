import { ConfigProvider } from "$lib/server/config/ConfigProvider";
import { db } from "$lib/server/db";
import { location } from "$lib/server/db/schema";

export const load = async () => {
    const config = ConfigProvider.getInstance().getConfig();
    const locations = await db
        .select()
        .from(location);

    return {
        config,
        locations:  locations.map((l) => ({
                id: l.id,
                name: l.name,
                description: l.description,
        }))
    } 
}