import db from '../../data/dbConfig';

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
}

function byId(id:number):Promise<PostType>  {
    return db("posts")
    .where({ id })
    .first();
}

function add(post:Partial<PostType>):Promise<PostType> {
    return db("posts")
    .insert(post)
    .then((ids:number[]) => {
        const [id] = ids;
        return byId(id);
    }) 
}

async function findBy(filter:Partial<PostType>):Promise<PostType[]> {
    return await db("posts").where(filter);
}

async function findByUsername(username:string):Promise<PostType> {
    return await db({
        user: 'users',
        post: 'posts',
    })
    .where({ username })
    .select({
        id: 'post.id',
        title: 'post.title',
        tags: 'post.tags',
        content: 'post.content'
    })
    .whereRaw('?? = ??', ['user.id', 'post.author_id']);
}

function update(id:number, data:Partial<PostType>) {
    let [d, t] = (new Date()).toISOString().split('T')
    let posted_at = `${d} ${t.split('.')[0]}`;
    return db("posts").where({ id }).update({...data, posted_at });
}
