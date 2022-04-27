import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('posts', posts => {
        posts.increments();
        posts
            .integer('author_id')
            .unsigned()
            .references('users.id');
        posts
            .string('title');
        posts
            .string('tags');
        posts
            .json('content');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('posts');
}

