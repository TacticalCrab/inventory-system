ALTER TABLE "location" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_item" ADD CONSTRAINT "stock_item_pkey" PRIMARY KEY("item_id","stock_id");--> statement-breakpoint
ALTER TABLE "item" ADD COLUMN "barcode" varchar;--> statement-breakpoint
ALTER TABLE "item_category" ADD CONSTRAINT "item_category_name_unique" UNIQUE("name");