import db from '../../data/dbConfig';
import { Friend } from '../common/types';

export default {
    byId,
    findBy,
    add,
    update,
    requestsTo,
    requestsFrom,
    remove
}

async function remove(id: number): Promise<any> {
    const record = await db("friends").where({ id }).first();
    await db("friends").where({ id }).delete();
    return record;
}

function add(friend: Partial<Friend>) {
    return db("friends").insert(friend);
}

function byId(id: number): Promise<Friend> {
    return db("friends")
        .where({ id })
        .first();
}

function findBy(filter: Partial<Friend>): Promise<Friend[]> {
    return db("friends").where(filter);
}

function update(id: number, data: Partial<Friend>): Promise<any> {
    return db("friends").where({ id }).update(data);
}

function requestsTo(user_id: number) {
    return db("friends")
        .join(
            "request-connect",
            "request-connect.id", "=", "friends.req_from",
        ).where({ to_id: user_id })
        .join("profiles",
            "profiles.user_id", "=", "request-connect.from_id"
        ).join("users",
            "users.id", "=", "profiles.user_id"
        )
        .select(
            "username",
            "name",
            "avatar",
            "email",
            "dob",
            "weight"
        );
}
function requestsFrom(user_id: number) {
    return db("friends")
        .join(
            "request-connect",
            "request-connect.id", "=", "friends.req_from",
        ).where({ from_id: user_id })
        .join("profiles",
            "profiles.user_id", "=", "request-connect.to_id"
        ).join("users",
            "users.id", "=", "profiles.user_id"
        )
        .select(
            "username",
            "name",
            "avatar",
            "email",
            "dob",
            "weight"
        );
}