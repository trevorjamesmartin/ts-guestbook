import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('profiles', profiles => {
        profiles.increments();
        profiles
            .integer('user_id')
            .unsigned()
            .references('users.id')
            .onDelete('SET NULL')
            .onUpdate('CASCADE');
        profiles
            .string('name');
        profiles
            .string('avatar');
        profiles
            .string('email');
        profiles
            .date('dob');
        profiles
            .json('config');
        profiles
            .timestamp('updated_at')
            .defaultTo(knex.fn.now());

    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('profiles')
}

