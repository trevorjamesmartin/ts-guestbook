import { actions as webSocketActions } from './socketSlice';
import { actions as usersActions } from '../users/userSlice';
import { actions as feedActions } from '../feed/feedSlice';
import { actions as threadActions, getThreadAsync } from '../thread/threadSlice';
import { actions as profileActions } from '../profile/profileSlice';
const { setStatusConnected, setStatusDisconnected, updateChat, clearChat, updateUserlist, updatePrivate } = webSocketActions;
const { update: updateFeed } = feedActions;
const { updateUsers } = usersActions;
const { updateListed } = threadActions;
const { updateProfile } = profileActions;
// TODO: specify events
export interface AppEventsMap {
  [event: string]: (...args: any[]) => void;
}

function ConfigureSocketEvents(socket: any, dispatch: any, profile: any, token: any, navigate: any) {
  // socket events are declared within the component, 
  // a hook from App (main) dispatches the update event. 
  // console.log('[io] register handlers')

  socket.on("connect", () => {
    console.log("connected");
    dispatch(setStatusConnected(socket, 'connected'));
    // save to Redux
  });

  socket.on("token?", () => {
    console.log('server reported token error');
    setTimeout(() =>
      navigate('/logout'),
      1700
    );
  });

  socket.on("question", () => {
    // with acknowledgement
    socket.emit('question', profile.username);
  })

  socket.on("disconnect", () => {
    // remove from Redux
    dispatch(setStatusDisconnected(socket, 'disconnected'));
  });

  socket.on("message", (data: any) => {
    dispatch(updateChat(['->', data]));
  });

  socket.on("joined:room", (room: string, username: string) => {
    dispatch(updateChat([`   + ${username} joined ${room}`]));
  })

  socket.on("departed:room", (room: string, username: string) => {
    dispatch(updateChat([`   - ${username} left ${room}`]));
  })

  socket.on('chat', (...args: any[]) => {
    let [msg,] = args;
    // console.log(msg);
    switch (msg[0]) {
      case '/clear':
        // console.log('clearing framebuffer');
        dispatch(clearChat());
        break;

      default:
        dispatch(updateChat(args));
        break;
    }

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

  socket.on("api:thread", (result: any[]) => {
    dispatch(updateListed(result));
  })

  socket.on("api:profile", (result: any) => {
    // console.log('-> api:profile', result);
    dispatch(updateProfile(result));
  })

  socket.on("private:message", (anotherUserName: string, msg: any) => {
    dispatch(updatePrivate([anotherUserName, msg]))
  });

  socket.on("whos:online", (userNames: string[]) => {
    dispatch(updateChat([
      "(online): ",
      userNames]))
  });

  socket.on("userlist", (userNames: string[]) => {
    // console.log('-> userlist')
    dispatch(updateUserlist(userNames));
  })

  socket.on("request:accepted", (anotherUsername:string, connect_id:number) => {
    console.log(anotherUsername, " accepted your friend request: ", connect_id);
  })

  socket.on("thread:updated", (thread_id:number, id:number) => {
    let message = `/thread/${thread_id} has been updated, ${id}`;
    dispatch(updateChat([message]))
    dispatch(getThreadAsync({ id: Number(thread_id), socket }));
  })

  socket.on("feed:updated", (username:string) => {
    // TODO
    // if username is a friend, refresh your feed or notify
    dispatch(updateChat(["[feed updated by]", username]))
  });

  socket.on("stream:log-info", (message:string) => {
    dispatch(updateChat([message]));
  })
  socket.on("stream:log-debug", (message:string) => {
    dispatch(updateChat([message]));
  })

}

export default ConfigureSocketEvents;
