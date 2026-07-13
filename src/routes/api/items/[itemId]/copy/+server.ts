import { createItem, getItem } from "$lib/server/db/queries/item";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({params}) => {
    const itemId = params.itemId;
    if (!itemId) {
        return json({ status: 403 });
    }

    const item = await getItem(parseInt(itemId));
    if (!item) {
        return json({ status: 403 })
    }

    await createItem({
        name: item.name,
        description: item.description,
        categories: item.categories,
        properties: item.properties,
    });

    return json({ status: 201 });
}