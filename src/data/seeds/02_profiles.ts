import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("profiles").del();

    // Inserts seed entries
    await knex("profiles").insert([
        {
            user_id: 1,
            name: 'Thomas A. Anderson',
            avatar: 'https://vigilant-s3.s3.amazonaws.com/neo2022-avatar.jpeg',
            email: 'neo@earth.net'
        },
        {
            user_id: 2,
            name: 'Morpheus',
            avatar: 'https://vigilant-s3.s3.amazonaws.com/morpheus-avatar.jpeg',
            email: 'root@localhost'
        },
        {
            user_id: 3,
            name: 'Trinity',
            avatar: 'https://vigilant-s3.s3.amazonaws.com/trinity-avatar.jpeg',
            email: 'trinity@whiterabbit.com'
        },
        {
            user_id: 4,
            name: 'Apoc',
            avatar: 'https://vigilant-s3.s3.amazonaws.com/apoc0-avatar.jpeg',
            email: 'apoc@lypse.com'
        },
        {
            user_id: 9,
            name: 'Cypher',
            avatar: 'https://vigilant-s3.s3.amazonaws.com/cypher-avatar.jpeg',
            email: 'cypher@mozilla.org'
        },
        {
            user_id: 5,
            name: 'Agent Brown',
            avatar: 'https://vigilant-s3.s3.amazonaws.com/abrown-avatar.jpeg',
            email: 'abrown@local.gov'
        },
        {
            user_id: 6,
            name: 'Agent Jones',
            avatar: 'https://vigilant-s3.s3.amazonaws.com/ajones-avatar.jpeg',
            email: 'ajones@infowars.gov'
        },
        {
            user_id: 12,
            name: 'The Oracle',
            avatar: 'https://vigilant-s3.s3.amazonaws.com/oracle-avatar.jpeg',
            email: 'oracle@delphi.org'
        },
        {
            user_id: 8,
            name: 'Dujour',
            avatar: 'https://vigilant-s3.s3.amazonaws.com/dujour-avatar.jpeg',
            email: 'dujour@163.com'
        },
        {
            user_id: 7,
            name: 'Choi',
            avatar: 'https://vigilant-s3.s3.amazonaws.com/choi-avatar.jpeg',
            email: 'choi@aol.com'
        },
        {
            user_id: 10,
            name: 'Dozer',
            avatar: 'https://vigilant-s3.s3.amazonaws.com/dozer-avatar.jpeg',
            email: 'dozer@earth.net'
        },
        {
            user_id: 15,
            name: 'Tank',
            avatar: 'https://vigilant-s3.s3.amazonaws.com/tank-avatar.jpeg',
            email: 'tank@nebuch.net'
        },
        {
            user_id: 14,
            name: 'Agent Smith',
            avatar: 'https://vigilant-s3.s3.amazonaws.com/smith-avatar.jpeg',
            email: 'smith@local.net'
        },
        {
            user_id: 11,
            name: 'Mouse',
            avatar: 'https://vigilant-s3.s3.amazonaws.com/mouse-avatar.jpeg',
            email: 'mouse@home.com'
        },
        {
            user_id: 13,
            name: 'Mr. Rhineheart',
            avatar: 'https://vigilant-s3.s3.amazonaws.com/rhineheart-avatar.jpeg',
            email: 'rhineheart@local.gov'
        }
    ]);
};
