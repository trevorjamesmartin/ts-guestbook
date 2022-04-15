import { Knex } from "knex";
import bcrypt from 'bcryptjs';

function genUser (name:string, password:string) {
    return {username: name, password: String(bcrypt.hashSync(password, 13))}
}

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();
    let pass = process.env.PW_STRING || "password"
    const users = [
        ["admin", `${pass}`],
        ["user1", `${pass}1`],
        ["user2", `${pass}2`]
    ].map(([a, b]) => genUser(a, b))
    // Inserts seed entries
    await knex("users").insert(users);
    await knex("profiles").insert([{user_id: 1}, {user_id: 2}, {user_id: 3}]);
};
