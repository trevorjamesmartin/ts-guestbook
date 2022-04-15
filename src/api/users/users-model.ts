import db from '../../data/dbConfig';

export interface UserType {
    id: number|undefined;
    username: string;
    password: string;
}

export default {
    add,
    list,
    findBy,
    findById
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
    .insert(user, "id")
    .then((ids:number[]) => {
        const [id] = ids;
        db("profiles").insert({ user_id: id })
        
        return findById(id);
    });
}


function findBy(filter:any) {
    return db("users")
        .select("id", "username", "password")
        .where(filter);
}
