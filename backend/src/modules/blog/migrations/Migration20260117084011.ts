import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260117084011 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "blog_post" drop constraint if exists "blog_post_handle_unique";`);
    this.addSql(`alter table if exists "blog_category" drop constraint if exists "blog_category_handle_unique";`);
    this.addSql(`create table if not exists "blog_category" ("id" text not null, "name" text not null, "handle" text not null, "description" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "blog_category_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_blog_category_handle_unique" ON "blog_category" ("handle") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_blog_category_deleted_at" ON "blog_category" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "blog_post" ("id" text not null, "title" text not null, "handle" text not null, "content" jsonb not null, "excerpt" text null, "thumbnail" text null, "published_at" timestamptz null, "meta_title" text null, "meta_description" text null, "keywords" text null, "category_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "blog_post_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_blog_post_handle_unique" ON "blog_post" ("handle") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_blog_post_category_id" ON "blog_post" ("category_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_blog_post_deleted_at" ON "blog_post" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "blog_post" add constraint "blog_post_category_id_foreign" foreign key ("category_id") references "blog_category" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "blog_post" drop constraint if exists "blog_post_category_id_foreign";`);

    this.addSql(`drop table if exists "blog_category" cascade;`);

    this.addSql(`drop table if exists "blog_post" cascade;`);
  }

}
