import logger from '../common/logger';
import connectRouter from './connect-router';
import friendsRouter from './friends-router';
export {
    connectRouter,
    friendsRouter
}
// TODO
export default (io: any, socket: any) => {
    function findUser(username: string) {
        let keys = io.sockets.sockets.keys()
        let result;
        try {
            for (let u of keys) {
                let i = io.sockets.sockets.get(u);
                if (i.data.username === username) {
                    result = i;
                    break;
                }
            }
            return result;
        } catch (error) {
            logger.error(error)
        }
    }
    const getRequests = (token: string) => {
        logger.debug('read social requests:', token);
    }
    socket.on("api:requests:read", getRequests);

    socket.on("request:accepted", (username: string, connect_id: number) => {
        logger.debug('REQUEST ACCEPTED, ' + username + " " + connect_id);
        let target = findUser(username);
        if (target) {
            target.emit("request:accepted", socket.data.username, connect_id);
        }
    })
}