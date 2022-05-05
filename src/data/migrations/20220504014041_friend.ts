import { Knex } from "knex";

// 

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('friends', (table) => {
        table.increments();
        table
            .integer('req_from')
            .unsigned()
            .references('request-connect.id')
            .onDelete('SET NULL')
            .onUpdate('CASCADE');
        table
            .integer('req_to')
            .unsigned()
            .references('request-connect.id')
            .onDelete('SET NULL')
            .onUpdate('CASCADE');
        table
            .timestamp('created_at')
            .defaultTo(knex.fn.now());
        table
            .timestamp('updated_at')
            .defaultTo(knex.fn.now());
        
        table
            .boolean('active')
            .defaultTo(true);

        table.unique(['req_from', 'req_to']);

    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('request-connect');
}

