import db from '../../data/dbConfig';

export interface ProfileType {
    id: number|undefined;
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
    update
}

function byId(id:number) {
    return db("profiles")
    .where({ id })
    .first();
}

function findBy(filter:Partial<ProfileType>) {
    return db("profiles")
    .select("name", "avatar", "email", "dob", "config")
    .where(filter);
}

function add(profile:Partial<ProfileType>) {
    return db("profiles")
    .insert(profile, "id")
    .then((ids:number[]) =>{
        const [id] = ids;
        return byId(id);
    });
}

function update(id:number, data:Partial<ProfileType>) {
    try {
        let previous = byId(id);
        return db("profiles")
        .update(data)
        .where({ id: previous.id });
    } catch (e) {
        console.log(e);
        return false;
    }
}
