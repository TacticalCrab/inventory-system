import { pgTable, foreignKey, integer, varchar, text, doublePrecision, primaryKey } from "drizzle-orm/pg-core"



export const item = pgTable("item", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "item_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar().notNull(),
	description: text(),
	imageUrl: varchar("image_url"),
	variantId: integer("variant_id"),
}, (table) => [
	foreignKey({
			columns: [table.variantId],
			foreignColumns: [itemsVariants.id],
			name: "item_variant_id_fkey"
		}).onDelete("set null"),
]);

export const itemProperty = pgTable("item_property", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "item_property_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar().notNull(),
	value: varchar().notNull(),
	typeName: varchar("type_name").notNull(),
	itemId: integer("item_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.itemId],
			foreignColumns: [item.id],
			name: "item_property_item_id_fkey"
		}).onDelete("cascade"),
]);

export const stocks = pgTable("stocks", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "stock_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	locationId: integer("location_id"),
}, (table) => [
	foreignKey({
			columns: [table.locationId],
			foreignColumns: [location.id],
			name: "stock_location_id_fkey"
		}).onDelete("set null"),
]);

export const stockItem = pgTable("stock_item", {
	itemId: integer("item_id").notNull(),
	stockId: integer("stock_id").notNull(),
	quantity: doublePrecision().default(0),
	unit: varchar(),
}, (table) => [
	foreignKey({
			columns: [table.itemId],
			foreignColumns: [item.id],
			name: "stock_items_item_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.stockId],
			foreignColumns: [stocks.id],
			name: "stock_items_stock_id_fkey"
		}).onDelete("cascade"),
]);

export const itemsVariants = pgTable("items_variants", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "item_variant_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar().notNull(),
	description: text(),
	imageUrl: varchar("image_url"),
});

export const location = pgTable("location", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "location_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar(),
	description: text(),
	imageUrl: varchar("image_url"),
});

export const itemCategory = pgTable("item_category", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "item_category_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: integer().notNull(),
});

export const itemItemCategory = pgTable("item_item_category", {
	itemId: integer("item_id").notNull(),
	itemCategoryId: integer("item_category_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.itemId],
			foreignColumns: [item.id],
			name: "item_item_category_item_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.itemCategoryId],
			foreignColumns: [itemCategory.id],
			name: "item_item_category_item_category_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.itemId, table.itemCategoryId], name: "item_item_category_pkey"}),
]);
