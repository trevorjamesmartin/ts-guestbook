import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { RootState } from '../../memory/store';
// import { persistedStore } from '../../memory/persist';
// import api from '../api';
interface privateChats {
    [key:string]: any[]
}

interface NetworkSocket {
    message: string | undefined;
    status: string;
    chat: any[];
    userlist: string[];
    private: privateChats;
    [key: string]: any;
}

const initialMessage: NetworkSocket = {
    message: undefined,
    status: 'disconnected',
    chat: [],
    userlist: [],
    private: {}
}

interface ioPayloadAction {
    payload: {
        text: string;
        createdAt: string;
    }
}

function socketEmitPayload(socket: any, text: string): ioPayloadAction {
    // if text is undefined, return blank
    if (!text) return {
        payload: {
            text: "",
            createdAt: ""
        }
    }

    socket.emit(text);
    
    return {
        payload: {
            text,
            createdAt: new Date().toISOString()
        }
    }
}

const setStatusConnected = createAction("socket/connect", socketEmitPayload);
const setStatusDisconnected = createAction("socket/disconnect", socketEmitPayload);

export const socketSlice = createSlice({
    name: 'socket',
    initialState: initialMessage,
    reducers: {
        echoPrivate: (state: NetworkSocket, action: PayloadAction<any[]>) => {
            let [anotherUserName, msg] = action.payload;
            if (!anotherUserName || !msg) {
                console.log(action);
                return
            }
            let message = "you 💬 " + msg;
            if (!state.private[anotherUserName]) {
                state.private[anotherUserName] = [message];
            } else {
                state.private[anotherUserName].push(message);
            }
        },
        updatePrivate: (state: NetworkSocket, action: PayloadAction<any[]>) => {
            let [anotherUserName, msg] = action.payload;
            if (!anotherUserName || !msg) {
                console.log(action);
                return
            }
            let message = anotherUserName + " 💬 " + msg;
            if (!state.private[anotherUserName]) {
                state.private[anotherUserName] = [message];
            } else {
                state.private[anotherUserName].push(message);
            }
        },
        updateChat: (state: NetworkSocket, action: PayloadAction<any[]>) => {
            let last = state.chat.slice(-1)[0];
            let cur = action.payload[0]
            if (last !== cur) {
                // + new information
                state.chat = [...state.chat, ...action.payload]
            }
        },
        clearChat: (state) => {
            state.chat = [];
        },
        updateUserlist: (state: NetworkSocket, action: PayloadAction<string[]>) => {
            state.userlist = action.payload;
        },
        clear: () => initialMessage
    },
    extraReducers: (builder) => {

        builder.addCase(setStatusConnected, (state: NetworkSocket, action: ioPayloadAction) => {
            state.status = action.payload.text;
        });

        builder.addCase(setStatusDisconnected, (state: NetworkSocket, action: ioPayloadAction) => {
            state.status = action.payload.text;
        })
    }
});
const selectMessage = (state: RootState) => state.socket.message;
const selectStatus = (state: RootState) => state.socket.status;
const selectChat = (state: RootState) => state.socket.chat;
const selectUserlist = (state:RootState) => state.socket.userlist;
const selectPrivate = (state:RootState) => state.socket.private

const { clear, updatePrivate, updateChat, clearChat, updateUserlist, echoPrivate } = socketSlice.actions;

export const selectors = {
    selectMessage,
    selectStatus,
    selectChat,
    selectUserlist,
    selectPrivate,
}

export const actions = {
    clear,
    echoPrivate,
    setStatusConnected,
    setStatusDisconnected,
    clearChat,
    updateChat,
    updateUserlist,
    updatePrivate
}

export default socketSlice.reducer;
