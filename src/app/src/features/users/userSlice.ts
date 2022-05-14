import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../network/api';
import {RootState} from '../../memory/store'

export const usersAsync = createAsyncThunk(
    'users/list',
    async (_, thunkAPI) => {
      const state:any = thunkAPI.getState();
      const token = state?.auth?.token || undefined;
      const response =await new api(token).get('/api/users/with-profiles'); // pending
      return response.data; // fulfilled
    }
);

export const userSlice = createSlice({
    name: 'users',
    initialState: { list: [], status: ''},
    reducers: {
        clear: (state) => {
            state.list = []
        }
    },
    extraReducers: (builder) => {
        builder.addCase(usersAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(usersAsync.fulfilled, (state, action:PayloadAction<any>) => {
            state.status = 'idle';
            state.list = action.payload;
        })
        .addCase(usersAsync.rejected, (state, action:PayloadAction<any>) =>{
            state.status= 'failed';
            state.list = [];
        })
    }

});

const selectList = (state:RootState) => state.users.list;
const selectStatus = (state:RootState) => state.users.status;
export const selectors = {
    selectList, selectStatus 
};

const { clear } = userSlice.actions;
export const actions = { 
    clear 
};

export default userSlice.reducer;
