import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../memory/store';
import { persistedStore } from '../../memory/persist';
// import api from '../api';

interface wsMessage {
    message: string | undefined;
    status: 'idle' | 'loading' | 'failed' | 'success';
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
            console.log('send over websocket')
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
    },
    extraReducers: (builder) => {
        builder.addCase(sendMessage.pending, (state:wsMessage) => {
            state.status = 'loading';
        })
        .addCase(sendMessage.fulfilled, (state:wsMessage, action:PayloadAction<any>) => {
            state.status = 'success';
            if (action.payload) {
                state.message = action.payload;
            }
        })
        .addCase(sendMessage.rejected, (state:wsMessage) => {
            state.status = 'failed';
        })
    }
});

const selectSentMessage = (state:RootState) => <string|undefined>state.socket.message;
const selectSentStatus = (state:RootState) => <string>state.socket.status;


export const selectors = {
    selectSentMessage,
    selectSentStatus
}

export default wsSlice.reducer;
