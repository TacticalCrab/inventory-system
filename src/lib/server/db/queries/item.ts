import {db, type DbTransaction} from "$lib/server/db";
import { and, eq, inArray, sql } from "drizzle-orm";
import { itemCategory, itemItemCategory, itemProperty } from "../schema";

export async function updateItemCategoriesByNames(tx: DbTransaction, itemId: number, categoryNames?: string[]) {
    if (!categoryNames || categoryNames.length === 0) {
        await db.delete(itemItemCategory)
            .where(eq(itemItemCategory.itemId, itemId));

        return;
    }

    const lowercaseNames = categoryNames.map(name => name.toLowerCase());

    await tx.insert(itemCategory)
        .values(categoryNames.map(name => ({name})))
        .onConflictDoNothing({
            target: itemCategory.name
        });
    
    const resolvedCategories = await tx
        .select({
            id: itemCategory.id,
            name: itemCategory.name
        })
        .from(itemCategory)
        .where(
            inArray(
                sql`lower(${itemCategory.name})`,
                lowercaseNames
            )
        );

    const desiredCategoryIds = resolvedCategories.map((c) => c.id);

    const currentItemCategories = await tx
        .select({
            categoryId: itemItemCategory.itemCategoryId
        })
        .from(itemItemCategory)
        .where(eq(itemItemCategory.itemId, itemId));
    
    const currentItemCategoriesIds = currentItemCategories.map((c) => c.categoryId);

    const currentCategoryIdSet = new Set(currentItemCategoriesIds);
    const desiredCategoryIdSet = new Set(desiredCategoryIds);

    const toDelete = Array.from(currentCategoryIdSet.difference(desiredCategoryIdSet));
    const toInsert = Array.from(
        desiredCategoryIdSet
            .difference(currentCategoryIdSet)
        )
    
    const promises = [];

    if (toDelete.length > 0) {
        promises.push(
            tx.delete(itemItemCategory)
            .where(
                and(
                    eq(itemItemCategory.itemId, itemId),
                    inArray(itemItemCategory.itemCategoryId, toDelete)
                )
            )
        )
    }

    if (toInsert.length > 0) {
        promises.push(
            tx
                .insert(itemItemCategory)
                .values(toInsert.map((categoryId) => ({
                    itemId,
                    itemCategoryId: categoryId
                })))
        )
    }

    await Promise.all(promises); 
}

export interface Property {
    id?: number;
    name?: string;
    value?: string;
}

export async function updateItemPropertiesByIds(tx: DbTransaction, itemId: number, properties: Property[]) {
    const currentProperties = await tx
    .select({
        id: itemProperty.id
    })
    .from(itemProperty)
    .where(eq(itemProperty.itemId, itemId));
    
    const currentPropertiesIds = new Set(currentProperties.map((p) => p.id));
    const updatedPropertiesIds = new Set(
        Object.values(properties)
            .reduce<number[]>((acc, curr) => {
                if (curr.id) {
                    acc.push(curr.id);
                }
                return acc;
            }, [])
    );

    const toDelete = currentPropertiesIds.difference(updatedPropertiesIds);

    await tx
        .delete(itemProperty)
        .where(
            and(
                eq(itemProperty.itemId, itemId),
                inArray(itemProperty.id, Array.from(toDelete))
            )
        );

    for (const property of properties) {
        if (property.id) {
            await tx
                .update(itemProperty)
                .set({
                    name: property.name,
                    value: property.value
                })
                .where(eq(itemProperty.itemId, itemId));
        } else if (!property.id) {
            await tx
                .insert(itemProperty)
                .values({
                    name: property.name || '',
                    value: property.value || '',
                    typeName: 'str',
                    itemId: itemId
                });
        }
    }
}