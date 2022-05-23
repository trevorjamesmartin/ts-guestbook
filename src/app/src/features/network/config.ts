import { actions as webSocketActions } from './socketSlice';
import { actions as usersActions } from '../users/userSlice';
import { actions as feedActions } from '../feed/feedSlice';
import { actions as threadActions } from '../thread/threadSlice';
const { setStatusConnected, setStatusDisconnected, updateChat } = webSocketActions;
const { clear: clearFeed, update: updateFeed } = feedActions;
const { updateUsers } = usersActions;
const {updateListed} = threadActions;

// TODO: specify events
export interface AppEventsMap {
  [event: string]: (...args: any[]) => void;
}


export default function (socket: any, dispatch: any, profile: any, token:any, navigate: any) {
  // socket events are declared within the component, 
  // a hook from App (main) dispatches the update event. 
  console.log('[io] register handlers')

  socket.on("connect", () => {
    console.log("connected");
    dispatch(setStatusConnected(socket, `hello:${profile.username}`));
    // save to Redux
  });

  socket.on("token?", () => {
    console.log('server reported token error');
    // let returnURL = window.location.toString();
    // navigate(`/reclaim?returnTo=${returnURL.match(/reclaim/) ? '/app' : returnURL}`);
  });

  socket.on("question", () => {
    // with acknowledgement
    socket.emit('question', profile.username);
  })

  socket.on("disconnect", () => {
    console.log("disconnected")
    // remove from Redux
    dispatch(setStatusDisconnected(socket, `goodbye:${profile.username}`));
  });

  socket.on("message", (data: any) => {
    // decode the payload.
    console.log('->', data);
  });

  socket.on('chat', (...args: any[]) => {
    dispatch(updateChat(args));
    // dispatch
  })

  socket.on('verify:auth', (...args: any[]) => {
    alert(args)
  });

  socket.on("api:users", (result: any) => {
    dispatch(updateUsers(result));
  })

  socket.on("api:usernames", (result: string[]) => {
    dispatch(updateChat(result));
  })

  socket.on("api:feed-content", (result: any) => {
    if (!Object.keys(result).includes('pages')) return
    dispatch(updateFeed(result));
  })

  socket.on("api:thread", (result: any[])=> {
    dispatch(updateListed(result));
  })

}