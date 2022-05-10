import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('posts', posts => {
        posts.increments();
        posts
            .integer('author_id')
            .unsigned()
            .references('users.id')
            .onDelete('SET NULL')
            .onUpdate('CASCADE');
        posts
            .string('title')
            .defaultTo(null);
        posts
            .string('tags')
            .defaultTo(null);
        posts
            .string('content')
            .notNullable();
        
        posts.integer('thread_id')
            .unsigned()
            .references('posts.id')
            .nullable()
            .onDelete('SET NULL')
            .onUpdate('CASCADE');

        posts.integer('parent_id')
            .unsigned()
            .references('posts.id')
            .nullable()
            .onDelete('SET NULL')
            .onUpdate('CASCADE');

        posts.timestamp('created_at')
            .defaultTo(knex.fn.now());
                        
        posts
            .timestamp('posted_at')
            .defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('posts');
}

