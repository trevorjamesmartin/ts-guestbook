import db from '../../data/dbConfig';

export interface ProfileType {
    id: number;
    user_id: number;
    name: string;
    avatar: string;
    email: string;
    dob: Date;
    config: JSON;
}

export default {
    findBy,
    byId,
    add,
    update,
    findByUsername,
    addByUsername
}

function byId(id:number) {
    return db("profiles")
    .where({ id })
    .first();
}

async function findBy(filter:Partial<ProfileType>) {
    return await db("profiles").where(filter);
}

async function findByUsername(username:string) {
    return await db("profiles")
    .join("users", "users.id", "=", "profiles.user_id")
    .where({ username })
    .first()
    .then(({ username, password, ...profile }:any) => profile);
}

async function addByUsername(username:string) {
    const user_id = (await db("users").where({ username }).first()).id;
    return db("profiles")
    .insert({ user_id })
    .then((ids:number[]) => {
        const [id] = ids;
        return byId(id);
    });
}

function add(profile:Partial<ProfileType>) {
    return db("profiles")
    .insert(profile)
    .then((ids:number[]) =>{
        const [id] = ids;
        return byId(id);
    });
}

function update(id:number, data:Partial<ProfileType>) {
    return db("profiles").where({ id }).update(data);
}
