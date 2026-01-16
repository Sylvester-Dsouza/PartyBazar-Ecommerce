import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260116193826 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "menu_item" drop constraint if exists "menu_item_menu_id_foreign";`);

    this.addSql(`alter table if exists "menu_item" add constraint "menu_item_menu_id_foreign" foreign key ("menu_id") references "menu" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "menu_item" drop constraint if exists "menu_item_menu_id_foreign";`);

    this.addSql(`alter table if exists "menu_item" add constraint "menu_item_menu_id_foreign" foreign key ("menu_id") references "menu" ("id") on update cascade;`);
  }

}
