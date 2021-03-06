import db from '../../data/dbConfig';
import { timestamp } from '../common/util';
import { PostType, PostedMessage } from '../common/types';
import usersModel from '../users/users-model';
import logger from '../common/logger';


export default {
    findBy,
    byId,
    add,
    update,
    findByUsername,
    findByThread,
    findByLimited,
    replyTo
}



async function replyTo(parent_id: number, post: Partial<PostType>, author_id: number): Promise<PostedMessage> {
    const op = await byId(Number(parent_id));
    let thread_id = op.thread_id ? op.thread_id : parent_id;
    let message = {
        ...post,
        author_id
    }
    return add(message, thread_id, parent_id);
}

function byId(id: number): Promise<PostedMessage> {
    return db('posts')
        .where({ id })
        .select('id', 'author_id', 'content', 'posted_at', 'created_at', 'parent_id', 'thread_id', 'title', 'tags')
        .first();
}

function add(post: Partial<PostType>, thread_id: number, parent_id: number): PostedMessage {
    return db("posts")
        .insert({
            ...post,
            thread_id: thread_id > 0 ? thread_id : null,
            parent_id: parent_id > 0 ? parent_id : null,
        }).returning('id')
}

async function findBy(filter: Partial<PostType>): Promise<PostType[]> {
    return await db("posts").where(filter);
}

async function findByLimited(filter: Partial<PostType>, limit: number): Promise<PostType[]> {
    return await db("posts").where(filter).limit(limit);
}

async function findByUsername(username: string): Promise<PostedMessage[]> {
    let u = await usersModel.userId(username);
    if (!u) {
        logger.info('no id found for user', username);
        return []
    }
    return await db("posts").where({ author_id: u.id })
}

async function findByThread(thread_id: number): Promise<any[]> {
    return await db("posts")
        .join("profiles", "profiles.id", "=", "posts.author_id")
        .join("users", "users.id", "=", "posts.author_id")
        .select({
            id: 'posts.id',
            author_id: 'posts.author_id',
            avatar: 'profiles.avatar',
            content: 'posts.content',
            created_at: 'posts.created_at',
            name: 'profiles.name',
            username: 'users.username',
            parent_id: 'posts.parent_id',
            posted_at: 'posts.posted_at',
            thread_id: 'posts.thread_id',
        })
        .where({ thread_id });

}
function update(id: number, data: Partial<PostType>) {
    return db("posts").where({ id }).update({ ...data, posted_at: timestamp() });
}
