import db from '../../data/dbConfig';
import {timestamp} from '../../util';
export interface MessagePointer {
    id: number;
    owner_id: number;
    thread_id: number;
    parent_id: number;
    created_at: any;
    updated_at: any;
}

export default {
    add,
    update,
    findBy,
    byThread,
    byId,
    byParent,
    byOwner
}

function byId(id:number):Promise<MessagePointer>  {
    return db("pointers")
    .where({ id })
    .first();
}

function add(pointer:Partial<MessagePointer>):Promise<MessagePointer> {
    return db("pointers")
    .insert(pointer)
    .then((ids:number[]) => {
        const [id] = ids;
        return byId(id);
    });
}

async function findBy(filter:Partial<MessagePointer>):Promise<MessagePointer[]> {
    return await db("pointers").where(filter);
}

async function byParent(parent_id:number):Promise<MessagePointer[]> {
    return await db("pointers").where({ parent_id });
}

async function byThread(thread_id:number):Promise<MessagePointer[]> {
    return await db("pointers").where({ thread_id });
}

async function byOwner(owner_id:number):Promise<MessagePointer> {
    return await db("pointers").where({ owner_id }).first();
}

function update(id:number, data:Partial<MessagePointer>) {
    return db("pointers").where({ id }).update({...data, updated_at: timestamp() });
}
