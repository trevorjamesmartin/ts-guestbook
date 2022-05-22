import { Request, Response } from 'express'
import authRouter from './auth-router';
import authMiddleware, { verifyToken } from './restricted-middleware';
import profileModel from '../users/profile-model';
import userMap from '../common/maps';

export {
  authRouter, authMiddleware
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
    user = userMap.getUser(decodedToken.username || username);
    console.log({user})
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
        // console.log(result);
        socket.emit('verify:auth', JSON.stringify(result));
      })
      .catch(error => socket.emit('verify:auth', JSON.stringify(error)))
  }

  const updateAuth = (token:any) => {
    console.log('VERIFY TOKEN, ', token);
    if (!token) {
      return;
    }
    let decodedToken:any = verifyToken(token);
    if (decodedToken !== 400) {
      console.log('decodedToken, ', decodedToken)
      return
    }
    let username = req.session.username;
    if (!username) {
      console.log('no username found in session.')      
    }
    user = userMap.getUser(decodedToken.username || username);
    user.updateAuth({
      token
    });
    console.log(user);
  }

  socket.on('verify:token', updateAuth)

  socket.on('whoami', verifyAuth); // easier to remember!

}