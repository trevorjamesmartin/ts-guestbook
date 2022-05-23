import usersRouter from './users-router';
import profileRouter from './profile-router';

export { usersRouter, profileRouter }

import { getPage } from '../common/util';
import Users from './users-model';

// *** io -> API ***

const GET_USERNAMES = "api:usernames";            // GET /api/users
const WITH_PROFILES = 'api:users:with-profiles';  // GET /api/users/with-profiles

// *** io -> io ***
const RETURN_USERNAMES = 'api:usernames'
const RETURN_USERLIST = 'api:users';

export default (io: any, socket: any) => {
  const decodedToken: any = socket.data.decodedToken;

  const getUsernames = (page?: string | number) => {
    getPage(decodedToken, Users.list, { page: page ? Number(page) : 1, limit: 50 })
      .then(result => {
        socket.emit(RETURN_USERNAMES, result.pages.map(u => u.username))
      })
      .catch(console.log)
  }

  const withProfiles = (params: any) => {
    const { subject, username } = decodedToken || {};
    let { page, limit } = params;
    if (username && subject) {
      getPage(decodedToken, Users.withProfiles, {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 200
      }).then(result => socket.emit(RETURN_USERLIST, result))
        .catch(console.log)
    }
  }
  socket.on(GET_USERNAMES, getUsernames);
  socket.on(WITH_PROFILES, withProfiles);
}
