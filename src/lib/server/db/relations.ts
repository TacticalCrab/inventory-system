import { relations } from "drizzle-orm/relations";
import { item, itemProperty, user, account, session, itemsVariants, location, stocks, stockItem, itemItemCategory, itemCategory } from "./schema";

export const itemPropertyRelations = relations(itemProperty, ({one}) => ({
	item: one(item, {
		fields: [itemProperty.itemId],
		references: [item.id]
	}),
}));

export const itemRelations = relations(item, ({one, many}) => ({
	itemProperties: many(itemProperty),
	itemsVariant: one(itemsVariants, {
		fields: [item.variantId],
		references: [itemsVariants.id]
	}),
	stockItems: many(stockItem),
	itemItemCategories: many(itemItemCategory),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const itemsVariantsRelations = relations(itemsVariants, ({many}) => ({
	items: many(item),
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