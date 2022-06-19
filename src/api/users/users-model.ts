import db from '../../data/dbConfig';
import { UserType } from '../common/types';
import { severTies } from '../social/connect-model';

export default {
    add,
    list,
    userId,
    findBy,
    findById,
    withProfiles,
    remove
}

function list() {
    return db("users").select("id", "username");
}


function findById(id: number) {
    return db("users")
        .select("id", "username")
        .where({ id })
        .first();
}


async function add(user: Partial<UserType>) {
    const { id: user_id, username } = (await db("users").insert(user).returning(["id", "username"]))[0];
    const profile = (await db("profiles").insert({ user_id }).returning("*"))[0];
    return { ...profile, username };
}

async function remove(user:Partial<UserType>) {
    if (!user.id) {
        return false
    }
    // remove profile
    let deleted = { profile: undefined, account: undefined, posts: undefined, connections: undefined }
    try {
        deleted.connections = await severTies(user.id);
        let posts = await db("posts").where({ author_id: user.id });
        for (let reply of posts) {
            await db("posts").where({ thread_id: reply.id }).del();
        }
        deleted.posts = await db("posts").where({ author_id: user.id }).del();
        deleted.profile = await db("profiles").where({user_id: user.id}).del();
        deleted.account = await db("users").where({ id: user.id }).del();
    } catch (error) {
        console.log(error);
    }
    return deleted
}

function findBy(filter: any) {
    return db("users")
        .select("id", "username", "password")
        .where(filter);
}

function userId(username: string) {
    return db("users")
        .select("id")
        .where({ username })
        .first();
}

async function withProfiles() {
    return await db("profiles")
        .join("users", "users.id", "=", "profiles.user_id")
        .select("username", "name", "avatar", "email", "dob", "created_at");
}

async function getSettings(user_id: number) {
    if (!user_id) return;
    return await db("profiles")
        .join("users", "users.id", "=", "profiles.user_id")
        .select("config")
        .where({ user_id })
        .first();
}

async function setSettings(user_id: number, config: JSON) {
    if (!user_id) return;
    return await db("profiles")
        .where({ user_id })
        .update({ config })
}

export async function updatePassword(user_id: number, newPassword: string) {
    let u = findById(user_id);
    if (!u || !newPassword) return;
    return await db('users')
        .where({ id: user_id })
        .update({ password: newPassword });
}

export const yourSettings = {
    get: getSettings,
    set: setSettings
}