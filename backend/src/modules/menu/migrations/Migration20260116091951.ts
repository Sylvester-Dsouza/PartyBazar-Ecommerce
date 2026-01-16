import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260116091951 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "menu_item" add column if not exists "link_type" text check ("link_type" in ('custom', 'home', 'store', 'collection', 'category', 'product', 'page')) not null default 'custom', add column if not exists "link_id" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "menu_item" drop column if exists "link_type", drop column if exists "link_id";`);
  }

}
