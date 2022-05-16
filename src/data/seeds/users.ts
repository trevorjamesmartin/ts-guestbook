import { Knex } from "knex";
import bcrypt from 'bcryptjs';

const SAMPLE_PROFILES = process.env.SAMPLE_SIZE ? Number(process.env.SAMPLE_SIZE) : 100;

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

function fromSampleData(count: number, start?: number): Sample[] {
    let limit = profiles.length - 1;
    let memo: { [key: string]: any } = {};
    let index: number;
    let x = start || 0;
    for (let id = (x + 1); id <= (x + count); id++) {
        index = Math.ceil(Math.random() * limit);
        if (memo[index]) {
            index = Math.ceil(Math.random() * limit);
        }
        memo[`${index}`] = id
    }
    let sample: Sample[] = [];
    for (let k of Object.keys(memo)) {
        let id = memo[k];
        sample.push({ ...profiles[Number(k)], id });
    }
    return sample.sort((s1, s2) => s1.id - s2.id);
}

export async function seed(knex: Knex): Promise<void> {
    await knex("users").del();
    let pass: string = process.env.PASSWORD || 'password'
    let admin = genUser("admin", `${pass}`);
    let development = genUser("development", `dev-${pass}`);
    let users: User[] = [admin, development];
    await knex("users").insert(users);
    let userProfiles: Partial<Profile>[] = [{ user_id: 1 }, { user_id: 2 }];
    await knex("profiles").insert(userProfiles);
    let sample = fromSampleData(SAMPLE_PROFILES, 2);
    for (let { id: user_id, name, email, avatar, username } of sample) {
        let newuser: User = genUser(username, 'sample');
        let newprofile: Partial<Profile> = { user_id, avatar: '/user.png', email, name };
        await knex("users").insert(newuser)
            .then(async () => {
                await knex("profiles")
                    .insert(newprofile);
            });
    }
};
