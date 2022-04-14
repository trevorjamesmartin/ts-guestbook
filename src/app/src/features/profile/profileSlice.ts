import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';
import {RootState} from '../../memory/store'

export const getProfileAsync = createAsyncThunk(
    'profile/get',
    async () => {
      const response = await api.get('/api/profile'); // pending
      return response.data; // fulfilled
    }
);

export const setProfileAsync = createAsyncThunk(
    'profile/set',
    async (data) => {
      const response = await api.put('/api/profile', data); // pending
      return response.data; // fulfilled
    }
);


const initialState = {
    name: '',
    avatar: '',
    email: '',
    dob: undefined,
    status: 'idle'
}

export const userSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clear: (state) => {
            state = {...initialState };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProfileAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(getProfileAsync.fulfilled, (state, action:PayloadAction<any>) => {
            state.status = 'idle';
            state.name = action.payload.name;
            state.avatar = action.payload.avatar;
            state.email = action.payload.email;
            state.dob = action.payload.dob;
        })
        .addCase(getProfileAsync.rejected, (state, action:PayloadAction<any>) =>{
            state = {... initialState, status: "failed" };
        })

        builder.addCase(setProfileAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(setProfileAsync.fulfilled, (state, action:PayloadAction<any>) => {
            state.status = 'idle';
            console.log(action.payload);
        })
        .addCase(setProfileAsync.rejected, (state, action:PayloadAction<any>) =>{
            console.log(action.payload);
            state = {... initialState, status: "failed" };
        })

    }

});

const selectStatus = (state:RootState) => state.users.status;
export const selectors = {
    selectStatus 
};

const { clear } = userSlice.actions;
export const actions = { 
    clear 
};

export default userSlice.reducer;
