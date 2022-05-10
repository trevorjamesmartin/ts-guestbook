import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('posts', table => {
    table.integer('pointer_id')
    .unique()
    .unsigned()
    .references('pointers.id')
    .onDelete('SET NULL')
    .onUpdate('CASCADE')
  })

}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('posts', table => {
    table.dropColumn('pointer_id');
  })
}

