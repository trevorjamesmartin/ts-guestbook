import db from '../../data/dbConfig';

export interface Friend {
    id: number;
    req_from: number;
    req_to: number;
    created_at: any;
    updated_at: any;
    active: boolean;
}

export default {
    byId,
    findBy,
    add,
    update,
    requestsTo,
    requestsFrom
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
        ).where({ active: true })
        .select(
            "username",
            "name",
            "avatar",
            "email",
            "dob",
            "active"
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
        ).where({ active: true })
        .select(
            "username",
            "name",
            "avatar",
            "email",
            "dob",
            "active"
        );
}