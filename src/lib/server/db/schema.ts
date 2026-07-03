import { pgTable, foreignKey, integer, varchar, index, text, timestamp, unique, boolean, doublePrecision, primaryKey } from "drizzle-orm/pg-core"



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

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("verification_identifier_idx").using("btree", table.identifier.asc().nullsLast().op("text_ops")),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	index("account_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	index("session_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const item = pgTable("item", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "item_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar().notNull(),
	description: text(),
	imageUrl: varchar("image_url"),
	variantId: integer("variant_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.variantId],
			foreignColumns: [itemsVariants.id],
			name: "item_variant_id_fkey"
		}).onDelete("set null"),
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

export const itemCategory = pgTable("item_category", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "item_category_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar().notNull(),
}, (table) => [
	unique("item_category_name_unique").on(table.name),
]);

export const itemsVariants = pgTable("items_variants", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "item_variant_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar().notNull(),
	description: text(),
	imageUrl: varchar("image_url"),
});

export const location = pgTable("location", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "location_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar().notNull(),
	description: text(),
	imageUrl: varchar("image_url"),
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
