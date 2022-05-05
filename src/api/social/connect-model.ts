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
    let [friend,] = await friendsModel.findBy({
        req_from: request_id1,
        req_to: request_id2,
    });
    if (!friend) {
        // check for existing record (to)
        [friend,] = await friendsModel.findBy({
            req_from: request_id2,
            req_to: request_id1,
        });
    }
    return friend;
}

async function acceptRequest(request_id: number, to_id: number) {
    const cr = await db("request-connect").where({ id: request_id, to_id }).first();
    const [accept_id] = await createRequest(to_id, cr.from_id, true); // acknowlege acceptance
    const friend = await existingRecord(request_id, accept_id);
    if (friend) {
        return [friend.id]
    }
    // CREATE friend record
    if (cr.accepted) {
        return await friendsModel.add({
            req_from: request_id,
            req_to: accept_id,
        });
    }
    return []
}

async function rejectRequest(request_id: number, to_id: number) {
    const cr = await db("request-connect").where({ id: request_id, to_id }).first();
    const [reject_id] = await createRequest(to_id, cr.from_id, false); // acknowledge rejection
    const friend = await existingRecord(request_id, reject_id);
    if (friend) {
        // DELETE friend record.
        await friendsModel.remove(friend.id);
        return [friend.id]
    }
    return [];
}

async function createRequest(from_id: number, to_id: number, accepted: boolean) {
    const cr = await db("request-connect").where({ from_id, to_id }).first();
    if (cr) {
        let { id } = cr;
        await db("request-connect")
            .where({ id })
            .update({
                updated_at: timestamp(),
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
