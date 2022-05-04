import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('posts', posts => {
        posts.increments();
        posts
            .integer('author_id')
            .unsigned()
            .references('users.id');
        posts
            .string('title')
            .defaultTo(null);
        posts
            .string('tags')
            .defaultTo(null);
        posts
            .json('content')
            .notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('posts');
}

