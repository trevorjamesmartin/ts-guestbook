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

function byId(id:number):Promise<ProfileType>  {
    return db("profiles")
    .where({ id })
    .first();
}

async function findBy(filter:Partial<ProfileType>):Promise<ProfileType[]> {
    return await db("profiles").where(filter);
}

async function findByUsername(username:string):Promise<ProfileType> {
    return await db("profiles")
    .join("users", "users.id", "=", "profiles.user_id")
    .where({ username })
    .first()
    .then((profile:any) => {
        // remove hashed password
        if (!profile) return {}
        let { password, ...rest } = profile;
        return rest;
    });
}

async function addByUsername(username:string):Promise<ProfileType|undefined>  {
    const user_id = (await db("users").where({ username })?.first())?.id;
    if (!user_id) {
        return undefined
    };
    return db("profiles")
    .insert({ user_id })
    .then(() => findByUsername(username));
}

function add(profile:Partial<ProfileType>):Promise<ProfileType> {
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
