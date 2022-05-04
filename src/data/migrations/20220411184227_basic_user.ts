import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', users => {
        users.increments();
        users
            .string('username', 128)
            .notNullable()
            .unique();

        users
            .string('password', 128)
            .notNullable();
        users
            .timestamp('created_at')
            .defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('users');
}

