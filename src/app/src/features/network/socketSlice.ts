import { createSlice, PayloadAction, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../memory/store';
import { persistedStore } from '../../memory/persist';
// import api from '../api';

interface NetworkSocket {
    message: string | undefined;
    status: string;
    chat: any[];
    userlist: string[];
    [key: string]: any;
}

const initialMessage: NetworkSocket = {
    message: undefined,
    status: 'disconnected',
    chat: [],
    userlist: []
}

interface ioPayloadAction {
    payload: {
        text: string;
        socket: any;
        createdAt: string;
    }
}

function socketPayload(socket: any, text: string): ioPayloadAction {
    return {
        payload: {
            text,
            socket,
            createdAt: new Date().toISOString()
        }
    }
}

const setStatusConnected = createAction("socket/connect", socketPayload);
const setStatusDisconnected = createAction("socket/disconnect", socketPayload);

export const socketSlice = createSlice({
    name: 'socket',
    initialState: persistedStore?.socket || initialMessage,
    reducers: {
        updateChat: (state: NetworkSocket, action: PayloadAction<any[]>) => {
            state.chat = [...state.chat, ...action.payload]
        },
        clearChat: (state) => {
            state.chat = [];
        }
    },
    extraReducers: (builder) => {

        builder.addCase(setStatusConnected, (state: NetworkSocket, action: ioPayloadAction) => {
            state.status = 'connected';
            action.payload.socket.emit(action.payload.text);
        });

        builder.addCase(setStatusDisconnected, (state: NetworkSocket, action: ioPayloadAction) => {
            state.status = 'disconnected';
            action.payload.socket.emit(action.payload.text);
        })
    }
});
const selectMessage = (state: RootState) => <string | undefined>state.socket.message;
const selectStatus = (state: RootState) => <string>state.socket.status;
const selectChat = (state: RootState) => <any[]>state.socket.chat;
const { updateChat, clearChat } = socketSlice.actions;

export const selectors = {
    selectMessage,
    selectStatus,
    selectChat
}

export const actions = {
    setStatusConnected,
    setStatusDisconnected,
    updateChat,
    clearChat
}

export default socketSlice.reducer;
