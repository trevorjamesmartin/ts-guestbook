import db from '../data/dbConfig';

export interface UserType {
    id: number|undefined;
    username: string;
    password: string;
}

export function list() {
    return db("users").select("id", "username");
}

export function findById(id:number) {
    return db("users")
    .select("id", "username")
    .where({ id })
    .first();
}

export function add(user:Partial<UserType>) {
    return db("users")
    .insert(user, "id")
    .then((ids:number[]) => {
        const [id] = ids;
        return findById(id);
    });
}

export function findBy(filter:any) {
    return db("users")
        .select("id", "username", "password")
        .where(filter);
}
