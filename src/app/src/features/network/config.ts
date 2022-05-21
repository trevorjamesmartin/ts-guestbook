import { actions as webSocketActions } from './socketSlice';
import { actions as usersActions } from '../users/userSlice';
const { setStatusConnected, setStatusDisconnected, updateChat } = webSocketActions;
const { updateUsers } = usersActions;

export default function (socket: any, dispatch: any, profile: any, navigate:any) {
  // socket events are declared within the component, 
  // because hooks (dispatch) update the store.

  socket.on("connect", () => {
    console.log("connected");
    dispatch(setStatusConnected(socket, `hello:${profile.username}`));
    // save to Redux
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

  socket.on("message", (data:any) => {
    // decode the payload.
    console.log('->', data);
  });

  socket.on('chat', (...args: any[]) => {
    dispatch(updateChat(args));
    // dispatch
  })

  socket.on('verify:auth', (...args: any[]) => {
    console.log(profile)
    alert(args)
  });

  socket.on("api:users", (result: any) => {
    dispatch(updateUsers(result));
  })
  socket.on("api:usernames", (result: string[]) => {
    console.log(result);
    dispatch(updateChat(result));
  })

  socket.on("api:feed-content", (result: any) => {
    console.log(result);
    if (!Object.keys(result).includes('pages')) return
    for (let t of result.pages) {
      let output = `/app/thread/${t.id}
      ${t.content}`;
      dispatch(updateChat([output]));
    }
  })

}