import { AuthMapItem } from './types';
import logger from "./logger";

interface UserMap {
  [username: string]: UserSpace
}

class UserSpace {
  username: string;
  loggedIn: boolean;
  uid: string; // <v4 uuid> express session
  private _token: string; // JWT
  private _socket: any;

  constructor(params: AuthMapItem) {
    this.username = params.username;
    this.uid = params.uid;
    this.loggedIn = params.loggedIn;
    this._token = params.token;
    this._socket = undefined;
  }

  updateAuth(v: Partial<AuthMapItem>) {
    if (v.uid) {
      this.uid = v.uid;
    }
    if (v.loggedIn) {
      this.loggedIn = v.loggedIn;
    }
    if (v.token) {
      this._token = v.token
    }
  }

  updateSocket(v: any) {
    this._socket = v;
  }

  public get socketId(): string {
    return this?._socket?.id;
  }


  public get token(): string {
    return this._token;
  }

  public set token(v: string) {
    this._token = v;
  }

  public get socket(): string {
    return this._socket;
  }

  public set socket(v: any) {
    this._socket = v;
  }

}

class MapConnector {
  private _authority: UserMap;

  constructor() {
    this._authority = {};
  }

  public getUser(username: string): UserSpace {
    return this._authority[username]
  }

  public addUser(v: AuthMapItem) {
    let r = this.getUser(v.username);
    if (r) {
      logger.debug(v.username, ' exists... updating');
      r.updateAuth(v);
    } else {
      this._authority[v.username] = new UserSpace(v);
    }
  }

  public updateAuth(username: string, v: Partial<AuthMapItem>) {
    let r = this.getUser(username);
    r.updateAuth(v);
  }

  /**
   * withSocketId
   */
  public withSocketId(socketId: string) {
    let username = Object.keys(this._authority)
      .filter(username => this._authority[username].socketId === socketId)[0];
    if (username) {
      return this.getUser(username);
    }
  }

}

// initialize
const appMap = new MapConnector()

export default appMap
