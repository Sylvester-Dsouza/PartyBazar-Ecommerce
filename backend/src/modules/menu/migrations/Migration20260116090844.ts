import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260116090844 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "menu" drop constraint if exists "menu_handle_unique";`);
    this.addSql(`create table if not exists "menu" ("id" text not null, "handle" text not null, "title" text not null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "menu_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_menu_handle_unique" ON "menu" ("handle") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_menu_deleted_at" ON "menu" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "menu_item" ("id" text not null, "menu_id" text not null, "parent_id" text null, "title" text not null, "url" text not null, "open_in_new_tab" boolean not null default false, "highlight" boolean not null default false, "highlight_text" text null, "icon" text null, "sort_order" integer not null default 0, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "menu_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_menu_item_menu_id" ON "menu_item" ("menu_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_menu_item_deleted_at" ON "menu_item" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "menu_item" add constraint "menu_item_menu_id_foreign" foreign key ("menu_id") references "menu" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "menu_item" drop constraint if exists "menu_item_menu_id_foreign";`);

    this.addSql(`drop table if exists "menu" cascade;`);

    this.addSql(`drop table if exists "menu_item" cascade;`);
  }

}
