import db from '../../data/dbConfig';
import pointerModel, {MessagePointer} from './pointer-model';
import { timestamp } from '../../util';
export interface PostType {
    id: number;
    author_id: number;
    title: string;
    tags: string;
    content: JSON;
    posted_at: any;
}

export default {
    findBy,
    byId,
    add,
    update,
    findByUsername,
    replyTo
}

type PointerIds = Pick<MessagePointer, "parent_id" | "thread_id" | "created_at">;

export type PostedMessage = Required<PostType & PointerIds>

async function replyTo(parent_id:number, post:Partial<PostType>):Promise<PostedMessage> {
    const op = await byId(parent_id);
    let thread_id = op.thread_id ? op.thread_id: parent_id;
    const reply = add(post, thread_id, parent_id);
    return reply;
}

function byId(id:number):Promise<PostedMessage> {
    return db({
        post: 'posts',
        pointer: 'pointers',
    })
    .whereRaw('?? = ??', ['post.id', id])
    .select({
        id: 'post.id',
        author_id: 'post.author_id',
        title: 'post.title',
        tags: 'post.tags',
        content: 'post.content',
        posted_at: 'post.posted_at',
        parent_id: 'pointer.parent_id',
        thread_id: 'pointer.thread_id',
        created_at: 'pointer.created_at',
    })
    .whereRaw('?? = ??', ['post.id', 'pointer.owner_id'])
    .first();
}

function add(post:Partial<PostType>, thread_id:number, parent_id:number):PostedMessage {
    return db("posts")
    .insert(post)
    .then(async (ids:number[]) => {
        const [owner_id] = ids;
        // create pointer
        await pointerModel.add({
            owner_id,
            thread_id,
            parent_id
        });
        return byId(owner_id);
    })
}

async function findBy(filter:Partial<PostType>):Promise<PostType[]> {
    return await db("posts").where(filter)
    .join({ pointer: "pointers" })
    .whereRaw('?? = ??', ['post.id', 'pointer.owner_id'])
    .select({
        id: 'post.id',
        author_id: 'post.author_id',
        title: 'post.title',
        tags: 'post.tags',
        content: 'post.content',
        posted_at: 'post.posted_at',
        parent_id: 'pointer.parent_id',
        thread_id: 'pointer.thread_id',
        created_at: 'pointer.created_at',
    });
}

async function findByUsername(username:string):Promise<PostedMessage[]> {
    return await db({
        user: 'users',
        post: 'posts',
    })
    .where({ username })
    .whereRaw('?? = ??', ['user.id', 'post.author_id'])
    .join({ pointer: "pointers" })
    .whereRaw('?? = ??', ['post.id', 'pointer.owner_id'])
    .select({
        id: 'post.id',
        author_id: 'post.author_id',
        title: 'post.title',
        tags: 'post.tags',
        content: 'post.content',
        posted_at: 'post.posted_at',
        parent_id: 'pointer.parent_id',
        thread_id: 'pointer.thread_id',
        created_at: 'pointer.created_at',
    });
}

function update(id:number, data:Partial<PostType>) {
    return db("posts").where({ id }).update({...data, posted_at: timestamp() });
}
