import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('pointers', (ptr) => {
        ptr.increments();
        
        ptr.integer('owner_id')
            .unique()
            .unsigned()
            .references('post.id')
            .onDelete('SET NULL')
            .onUpdate('CASCADE');

        ptr.integer('thread_id')
            .unsigned()
            .defaultTo(0)
            .references('post.id')
            .onDelete('SET NULL')
            .onUpdate('CASCADE');

        ptr.integer('parent_id')
            .unsigned()
            .defaultTo(0)
            .references('post.id')
            .onDelete('SET NULL')
            .onUpdate('CASCADE');

        ptr.timestamp('created_at')
            .defaultTo(knex.fn.now());

        ptr.timestamp('updated_at')
            .defaultTo(knex.fn.now());

        ptr.unique(['thread_id', 'parent_id', 'owner_id'])
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('pointer');
}

