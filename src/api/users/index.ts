import usersRouter from './users-router';
import profileRouter from './profile-router';

export { usersRouter, profileRouter }

import { getPage } from '../common/util';
import Users from './users-model';
import Profiles from './profile-model';
// *** io -> API ***

const GET_USERNAMES = 'api:usernames';            // GET /api/users
const WITH_PROFILES = 'api:users:with-profiles';  // GET /api/users/with-profiles
const GET_PROFILE = 'api:profile';
// *** io -> io ***
const RETURN_USERNAMES = 'api:usernames'
const RETURN_USERLIST = 'api:users';
const RETURN_PROFILE = 'api:profile';

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

  const getProfile = () => {
    if (decodedToken.subject) {
      Profiles.yourProfile(decodedToken.subject, decodedToken.username)
      .then(result => {
        // console.log(result);
        console.log('⇨ ', decodedToken.username, RETURN_PROFILE);
        socket.emit(RETURN_PROFILE, result);
      })
      .catch(console.log);
    }
  }

  socket.on(GET_USERNAMES, getUsernames);
  socket.on(WITH_PROFILES, withProfiles);
  socket.on(GET_PROFILE, getProfile);

}
