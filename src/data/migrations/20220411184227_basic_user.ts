import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', table => {
        table.increments();
        table
            .string('username', 128)
            .notNullable();
        table
            .string('password', 128)
            .notNullable();
        table
            .timestamp('created_at')
            .defaultTo(knex.fn.now());
        table.unique(['username']);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('users');
}

