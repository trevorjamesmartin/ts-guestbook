import { Request, Response } from 'express'
import authRouter, {sessionParser, } from './auth-router';
import authMiddleware, { verifyToken } from './restricted-middleware';
import profileModel from '../users/profile-model';
import userMap from '../common/maps';

export {
  authRouter, authMiddleware, sessionParser
}

export default (io: any, socket: any) => {
  let req = socket.request as Request<any>;
  let res = req.res as Response<any>;

  let user = userMap.withSocketId(socket.id);
  let token = user?.token;
  let decodedToken: any = undefined;
  if (token) {
    decodedToken = verifyToken(token);
  }

  // console.log("[]", res)
  const verifyAuth = () => {
    let username:string = socket.data.username;
    let uid = socket.data.uid;
    let loggedIn = socket.data.loggedIn;
    let verified = false;
    let token = socket.data.token;
    let decodedToken:any = verifyToken(token);

    if (decodedToken?.username) {
      verified = true;
    }

    // check user map
    let m = userMap.getUser(decodedToken.username || username);
    console.log({m})
    let result = {
      [username]: decodedToken?.username,
      loggedIn,
      verified,
      uid      
    }
    if (!verified) {
      return socket.emit('verify:auth', JSON.stringify(result));
    }

    // lookup profile
    profileModel.findByUsername(username)
      .then((fulfilled: any) => {
        let { username, avatar, user_id } = fulfilled;
        let result = {
          [username]: decodedToken?.username,
          username: username,
          avatar,
          id: user_id,
          loggedIn,
          verified,
          uid      
        }
        console.log(result);
        socket.emit('verify:auth', JSON.stringify(result));
      })
      .catch(error => socket.emit('verify:auth', JSON.stringify(error)))
  }

  const updateAuth = (token:string) => {
    let username = req.session.username;
    if (!username) {
      console.log('no username found in session.')
    }

    let decodedToken:any = verifyToken(token);
    if (decodedToken !== 400) {
      console.log('decodedToken, ', decodedToken)
      return
    }

  }

  socket.on('update:auth', updateAuth)

  socket.on('verify:auth', verifyAuth);

  socket.on('whoami', verifyAuth); // easier to remember!

}