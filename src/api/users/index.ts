import usersRouter from './users-router';
import profileRouter from './profile-router';
import userMap from '../common/maps';
import { getPage } from '../common/util';
import Users, { UserType } from './users-model';
import { verifyToken } from '../auth/restricted-middleware';
export { usersRouter, profileRouter }

// *** io -> REST ***

const GET_USERNAMES = "api:usernames";                       // GET /api/users
const WITH_PROFILES = 'api:users:with-profiles';  // GET /api/users/with-profiles

// *** REST -> io ***
const RETURN_USERNAMES = 'api:usernames'
const RETURN_USERLIST = 'api:users';

export default (io: any, socket: any) => {
  let user = userMap.withSocketId(socket.id);
  let token = user?.token;
  let decodedToken: any = undefined;

  if (token) {
    decodedToken = verifyToken(token);
  }

  const getUsernames = (page?: string | number) => {
    console.log(RETURN_USERNAMES)
    getPage(decodedToken, Users.list, { page: page ? Number(page) : 1, limit: 50 })
      .then(result => {
        socket.emit(RETURN_USERNAMES, result.pages.map(u => u.username))
      })
      .catch(console.log)
  }

  const withProfiles = (page?: string | number) => {
    let subject;
    let username;

    if (decodedToken && decodedToken !== 400) {
      username = decodedToken.username;
      subject = decodedToken.subject;
    }
    if (user?.username && user.username === username) {
      console.log({ verified: true })
      console.log(username, 'requested a list of users');
      getPage(decodedToken, Users.withProfiles, {
        page: page ? Number(page) : 1,
        limit: 200
      }).then(result => socket.emit(RETURN_USERLIST, result))
        .catch(console.log)
    }
  }

  socket.on(GET_USERNAMES, getUsernames);
  socket.on(WITH_PROFILES, withProfiles);

}
