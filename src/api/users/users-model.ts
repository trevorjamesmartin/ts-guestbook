import db from '../../data/dbConfig';

export interface UserType {
    id: number|undefined;
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
    withProfiles
}

function list() {
    return db("users").select("id", "username");
}


function findById(id:number) {
    return db("users")
    .select("id", "username")
    .where({ id })
    .first();
}


function add(user:Partial<UserType>) {
    return db("users")
    .insert(user)
    .then((ids:number[]) => {
        const [id] = ids;
        return findById(id);
    });
}

function findBy(filter:any) {
    return db("users")
        .select("id", "username", "password")
        .where(filter);
}

function userId(username:string) {
    return db("users")
        .select("id")
        .where({username})
        .first();
}

async function withProfiles() {
    return await db("profiles")
    .join("users", "users.id", "=", "profiles.user_id")
    .select("username", "name", "avatar", "email", "dob", "created_at");
}
