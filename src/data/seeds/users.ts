import { Knex } from "knex";
import bcrypt from 'bcryptjs';

const SAMPLE_PROFILES = process.env.SAMPLE_SIZE ? Number(process.env.SAMPLE_SIZE) : 24;

interface Sample {
    id: number;
    name: string;
    email: string;
    avatar: string;
    username: string;
    password: string;
}
interface User {
    username: string;
    password: string;
}
interface Profile {
    user_id: number;
    name: string | undefined | null;
    avatar: string | undefined | null;
    email: string | undefined | null;
}

function genUser(name: string, password: string) {
    return { username: name, password: String(bcrypt.hashSync(password, 13)) }
}

const profiles = require('../sample/profiles.json');

function fromSampleData(count: number, start?: number) {
    let limit = profiles.length - 1;
    let sample: Sample[] = [];
    let index: number;
    let x = start || 0;
    for (let id = (x + 1); id <= (x + count); id++) {
        index = Math.ceil(Math.random() * limit);
        sample.push({
            id, ...profiles[index]
        });
    }
    return sample;
}



export async function seed(knex: Knex): Promise<void> {
    await knex("users").del();
    let pass: string = process.env.PASSWORD || 'password'
    let admin = genUser("admin", `${pass}`);
    let development = genUser("development", `dev-${pass}`);
    let users: User[] = [ admin, development ];
    await knex("users").insert(users);
    let userProfiles: Partial<Profile>[] = [{ user_id:1 }, { user_id:2 }];
    await knex("profiles").insert(userProfiles);
    let sample = fromSampleData(SAMPLE_PROFILES, 2);
    for (let { id: user_id, name, email, avatar, username } of sample) {
        let newuser:User = genUser(username, 'sample');
        let newprofile:Partial<Profile> = { user_id, avatar: `${avatar.split('?')[0]}?size=100x100?set=set5`, email, name };
        console.log(newuser);
        await knex("users").insert(newuser);
        console.log(newprofile);
        await knex("profiles").insert(newprofile);
    }
};
