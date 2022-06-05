import db from '../../data/dbConfig';

export interface UserType {
    id: number | undefined;
    username: string;
    password: string;
    created_at: any;
}

export default {
    add,
    list,
    userId,
    findBy,
    findById,
    withProfiles,
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

export const yourSettings = {
    get: getSettings,
    set: setSettings
}