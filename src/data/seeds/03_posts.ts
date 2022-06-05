import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("posts").del();

    // Inserts seed entries
    await knex("posts").insert([
        {
            author_id: 2,
            content: 'There is a difference between knowing the path and walking the path.',
        },
        {
            author_id: 3,
            content: 'The Matrix Cannot Tell You Who You Are.',
        },
        { author_id: 1, content: 'Whoa' },
        {
            author_id: 1,
            content: 'know how to play frisbee golf ?',
            parent_id: 1,
            thread_id: 1
        },
        {
            author_id: 12,
            content: "You didn't come here to make the choice. You've already made it. You're here to try to understand why you made it.",
        }
    ]);
};
