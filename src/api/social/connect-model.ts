import db from '../../data/dbConfig';
import profileModel from '../users/profile-model';
import friendsModel from './friends-model';
export interface RequestConnect {
    id: number;
    from_id: number;
    to_id: number;
    accepted: boolean;
    created_at: any;
    updated_at: any;
}

export default {
    byId,
    findBy,
    acceptRequest,
    cancelRequest,
    createRequest,
    rejectRequest,
    connectedTo
}

function byId(id: number): Promise<RequestConnect> {
    return db("request-connect")
        .where({ id })
        .first();
}

async function findBy(filter: Partial<RequestConnect>): Promise<RequestConnect[]> {
    return await db("request-connect").where(filter);
}

async function acceptRequest(request_id: number, to_id: number) {
    const cr = await db("request-connect").where({ id: request_id, to_id }).first();
    const [accept_id] = await createRequest(to_id, cr.from_id, true);
    // check for existing record
    let [friend] = await friendsModel.findBy({
        req_from: request_id,
        req_to: accept_id,
    });
    let swap = false;
    if (!friend) {
        // swap places
        [friend] = await friendsModel.findBy({
            req_to: request_id,
            req_from: accept_id,
        });
        swap = true;
    }
    if (friend && friend.active) {
        console.log(`active friends  sw:${swap}`);
        console.log(friend)
        return [friend.id]
    }
    if (friend && !friend.active && friend.req_from === request_id) {
        console.log('scenario A')
        // await friendsModel.update(friend.id, { active: true });
        return [friend.id]
    }
    if (friend && !friend.active && friend.req_to === request_id) {
        console.log('scenario B')
        return [friend.id]
    }
    // create friend record
    console.log('create new friendship')
    return await friendsModel.add({
        req_from: request_id,
        req_to: accept_id,
        active: true
    });
}

async function rejectRequest(request_id: number, to_id: number) {
    const cr = await db("request-connect").where({ id: request_id, to_id }).first();
    const [reject_id] = await createRequest(to_id, cr.from_id, false);
    // check for a friend record
    const [friend] = await friendsModel.findBy({
        req_from: request_id,
        req_to: reject_id,
    });
    console.log(friend);
    if (friend && friend.active) {
        // set active = false ?
        await friendsModel.update(friend.id, { active: false });
        return [friend.id]
    }
    if (friend && !friend.active) {
        return [friend.id]
    }
    // create friend record
    return await friendsModel.add({
        req_from: request_id,
        req_to: reject_id,
        active: false
    });
}

function cancelRequest(request_id: number, from_id: number) {
    let [d, t] = (new Date()).toISOString().split('T')
    let updated_at = `${d} ${t.split('.')[0]}`;
    return db("request-connect")
        .where({
            id: request_id,
            from_id,
        })
        .update({
            accepted: false,
            updated_at
        });
}

async function createRequest(from_id: number, to_id: number, accepted: boolean) {
    const cr = await db("request-connect").where({ from_id, to_id }).first();
    if (cr) {
        let { id } = cr;
        let [d, t] = (new Date()).toISOString().split('T');
        let updated_at = `${d} ${t.split('.')[0]}`;
        await db("request-connect")
            .where({ id })
            .update({
                updated_at,
                accepted
            });
        return [id]
    }
    return db("request-connect")
        .insert({
            from_id,
            to_id,
            accepted,
        });
}

const withProfiles = async (rcList: RequestConnect[]) => {
    let friends: any[] = [];
    for (let r of rcList) {
        let profile = await profileModel.findByUserId(r.from_id);
        friends = [...friends, {
            connect_id: r.id,
            username: profile.username,
            name: profile.name,
            avatar: profile.avatar,
            email: profile.email,
            dob: profile.dob
        }];
    }
    return friends;
}


async function connectedTo(target_id: number): Promise<any> {
    const toTarget = await db("request-connect").where({ to_id: target_id });
    const fromTarget = await db("request-connect").where({ from_id: target_id });
    const findMatch = (to_id: number) => fromTarget.filter((c: RequestConnect) => c.to_id === to_id)[0];
    const pending = toTarget.filter(({ from_id, accepted }: RequestConnect) => !accepted || !(findMatch(from_id)?.accepted));
    const connections = toTarget.filter(({ from_id, accepted }: RequestConnect) => accepted && findMatch(from_id)?.accepted);
    return {
        friends: await withProfiles(connections),
        requests: await withProfiles(pending)
    }
}
