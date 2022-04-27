import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../memory/store';
import { persistedStore } from '../../memory/persist';
// import api from '../api';

interface wsMessage {
    message: string | undefined;
    status: string;
    [key:string]:any;
}

const initialMessage:wsMessage = {
    message: undefined,
    status: 'idle'
}

interface wsPayload {
    ws: WebSocket|undefined;
    message: string
}

export const sendMessage = createAsyncThunk(
    'socket/send',
    async (payload:wsPayload) => {
        const { ws, message } = payload;
        if (ws) {
            // send over websocket
            // console.log('send over websocket', message)
            ws.send(message);
            return message
        } else {
            console.log('websocket not found.')
            // send over api ?
            return false
        }
    }
);

export const wsSlice = createSlice({
    name: 'socket',
    initialState: persistedStore?.socket || initialMessage,
    reducers: {
        //
        setStatusConnected: (state) => {
            state.status = 'idle';
        },
        setStatusDisconnected: (state) => {
            state.status = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(sendMessage.pending, (state:wsMessage) => {
            state.status = 'sending';
        })
        .addCase(sendMessage.fulfilled, (state:wsMessage, action:PayloadAction<any>) => {
            state.status = '';
            if (action.payload) {
                state.message = action.payload;
            }
        })
        .addCase(sendMessage.rejected, (state:wsMessage) => {
            state.status = 'failed';
        })
    }
});
const {setStatusConnected, setStatusDisconnected} = wsSlice.actions;
const selectSentMessage = (state:RootState) => <string|undefined>state.socket.message;
const selectSentStatus = (state:RootState) => <string>state.socket.status;


export const selectors = {
    selectSentMessage,
    selectSentStatus
}

export const actions = {
    setStatusConnected,
    setStatusDisconnected
}

export default wsSlice.reducer;
