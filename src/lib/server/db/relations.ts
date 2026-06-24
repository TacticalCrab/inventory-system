import { relations } from "drizzle-orm/relations";
import { itemsVariants, item, itemProperty, location, stocks, stockItem, itemItemCategory, itemCategory } from "./schema";

export const itemRelations = relations(item, ({one, many}) => ({
	itemsVariant: one(itemsVariants, {
		fields: [item.variantId],
		references: [itemsVariants.id]
	}),
	itemProperties: many(itemProperty),
	stockItems: many(stockItem),
	itemItemCategories: many(itemItemCategory),
}));

export const itemsVariantsRelations = relations(itemsVariants, ({many}) => ({
	items: many(item),
}));

export const itemPropertyRelations = relations(itemProperty, ({one}) => ({
	item: one(item, {
		fields: [itemProperty.itemId],
		references: [item.id]
	}),
}));

export const stocksRelations = relations(stocks, ({one, many}) => ({
	location: one(location, {
		fields: [stocks.locationId],
		references: [location.id]
	}),
	stockItems: many(stockItem),
}));

export const locationRelations = relations(location, ({many}) => ({
	stocks: many(stocks),
}));

export const stockItemRelations = relations(stockItem, ({one}) => ({
	item: one(item, {
		fields: [stockItem.itemId],
		references: [item.id]
	}),
	stock: one(stocks, {
		fields: [stockItem.stockId],
		references: [stocks.id]
	}),
}));

export const itemItemCategoryRelations = relations(itemItemCategory, ({one}) => ({
	item: one(item, {
		fields: [itemItemCategory.itemId],
		references: [item.id]
	}),
	itemCategory: one(itemCategory, {
		fields: [itemItemCategory.itemCategoryId],
		references: [itemCategory.id]
	}),
}));

export const itemCategoryRelations = relations(itemCategory, ({many}) => ({
	itemItemCategories: many(itemItemCategory),
}));