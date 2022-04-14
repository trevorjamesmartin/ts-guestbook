import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('profiles', profiles => {
        profiles.increments();
        profiles
            .integer('user_id')
            .unsigned()
            .references('users.id');
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
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('profiles')
}

