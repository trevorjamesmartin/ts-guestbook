import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('request-connect', (table) => {
        table.increments();
        table
            .integer('from_id')
            .unsigned()
            .references('users.id')
            .onDelete('SET NULL')
            .onUpdate('CASCADE');
        table
            .integer('to_id')
            .unsigned()
            .references('users.id')
            .onDelete('SET NULL')
            .onUpdate('CASCADE');
        table
            .boolean('accepted')
            .defaultTo(false);
        table
            .timestamp('created_at')
            .defaultTo(knex.fn.now());
        table
            .timestamp('updated_at')
            .defaultTo(knex.fn.now());
            
        table.unique(['from_id', 'to_id']);

    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('request-connect')
}

