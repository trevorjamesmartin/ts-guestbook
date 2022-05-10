import { Knex } from "knex";
import bcrypt from 'bcryptjs';

function genUser(name: string, password: string) {
    return { username: name, password: String(bcrypt.hashSync(password, 13)) }
}

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();
    let pass = process.env.PASSWORD || "gnu1baw_GWD1fea_tqt"
    const users = [
        ["admin", `${pass}`],
        ["development", `dev-${pass}`],
        // ["john", "4beatles"],
        // ["paul", "4beatles"],
        // ["george", "4beatles"],
        // ["ringo", "4beatles"]
    ].map(([a, b]) => genUser(a, b))
    // Inserts seed entries
    await knex("users").insert(users);
    await knex("profiles").insert([
        { user_id: 1 },
        { user_id: 2 },
        // { user_id: 3, avatar: "/beatle.gif" },
        // { user_id: 4, avatar: "/beatle.gif" },
        // { user_id: 5, avatar: "/beatle.gif" },
        // { user_id: 6, avatar: "/beatle.gif" },
    ]);
};
