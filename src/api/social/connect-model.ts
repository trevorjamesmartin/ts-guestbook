import db from '../../data/dbConfig';
import profileModel from '../users/profile-model';
import friendsModel from './friends-model';
import { timestamp } from '../../util';

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

async function existingRecord(request_id1:number, request_id2:number) {
    // check for existing record (from)
    let from_to = await friendsModel.findBy({
        req_from: request_id1,
        req_to: request_id2,
    });
    if (!(Array.isArray(from_to) && Array.length > 0)) {
        // check for existing record (to)
        let to_from = await friendsModel.findBy({
            req_from: request_id2,
            req_to: request_id1,
        });
        return to_from[0]
    }
    return from_to[0];
}

async function acceptRequest(request_id: number, to_id: number) {
    const n_from = Number(request_id);
    const n_to = Number(to_id);
    const cr = await db("request-connect").where({ id: n_from, to_id: n_to }).first();
    const acknowleged = await createRequest(n_to, cr.from_id, true); // acknowlege acceptance
    if (!acknowleged) {
        return []
    }
    const [accepted] = acknowleged;
    let friend = await existingRecord(n_from, accepted.id);
    if (friend) {
        return [friend.id]
    }
    // CREATE friend record
    if (cr.accepted) {
        let [friend] = await friendsModel.add({
            req_from: n_from,
            req_to: accepted.id,
        }).returning('id');
        return [friend.id]
    }
    return []
}

async function rejectRequest(request_id: number, to_id: number) {
    const cr = await db("request-connect").where({ id: request_id, to_id }).first();
    // const [reject_id] = await createRequest(to_id, cr.from_id, false); // acknowledge rejection
    const acknowleged = await createRequest(to_id, cr.from_id, false); // acknowlege rejection
    if (!acknowleged) {
        console.log('createRequest returned', acknowleged)
        return []
    }
    const [rejected] = acknowleged
    const friend = await existingRecord(request_id, rejected.id);
    if (friend) {
        // DELETE friend record.
        await friendsModel.remove(friend.id);
        return [friend.id]
    }
    return [];
}

async function createRequest(from_id: number, to_id: number, accepted: boolean) {
    const existingRequest = await db("request-connect").where({ from_id, to_id }).first();
    if (existingRequest) {
        let { id } = existingRequest;
        let updated = await db("request-connect")
            .where({ id })
            .update({
                updated_at: timestamp(),
                accepted
            });
        if (updated) {
            return [{id}]
        }
        return []
    }
    return await db("request-connect")
        .insert({
            from_id,
            to_id,
            accepted,
        }).returning("*")
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
