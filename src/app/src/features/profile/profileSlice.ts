import { createSlice, PayloadAction, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';
import api from '../api';
import axios from 'axios';
import {RootState} from '../../memory/store'
import { persistedStore } from '../../memory/persist';

export const getProfileAsync = createAsyncThunk(
    'profile/get',
    async (_, thunkAPI) => {
        console.log('GET PROFILE')
      const state:any = thunkAPI.getState();
      const token = state?.auth?.token || undefined;
      const response = await api(token).get('/api/profile'); // pending
      return response.data; // fulfilled
    }
);

export const setProfileAsync = createAsyncThunk(
    'profile/set',
    async (data:any, thunkAPI) => {
      const {status, ...profileData  } = data; // separate status from profile data;
      const {name, email, dob, avatar, id } = data
      const state:any = thunkAPI.getState();
      const token = state?.auth?.token || undefined;
      // upload to s3 
      const cloud = api(token);
      console.log('requesting s3 signature')
      const {data: signature} = await cloud.get(`/api/aws/sign-s3?file-name=${profileData.username}-avatar.jpeg&file-type=image/jpeg`);
      let {signedRequest, url} = signature;
      console.log({signature})
      console.log('uploading avatar to s3 bucket...')
      let bucketed = await axios.put(signedRequest, avatar);
      console.log({response: bucketed.data});
      // update profile with s3 URL
      const payload = { name, avatar: url, email, dob };
      await cloud.put('/api/profile', payload); // pending
      return payload; // fulfilled
    }
);

export interface profileStore {
    username: string;
    user_id: number;
    name: string|undefined;
    avatar: string|undefined;
    email: string|undefined;
    dob: string|Date|undefined;
    status: string;
}

const initialState = persistedStore?.profile || {
    username: '',
    user_id: 0,
    name: '',
    avatar: '',
    email: '',
    dob: '',
    status: ''
}

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setField: (state, action:PayloadAction<any>) => {
            state.status  = 'setField, pending';
            for (let fieldName of Object.keys(action.payload)) {
                let value = action.payload[fieldName];
                state.status = `set ${fieldName}`;
                switch (fieldName) {
                    case 'name':
                        state.name = value;
                        break;
                    case 'avatar':
                        state.avatar = value;
                        break;
                    case 'email':
                        state.email = value;
                        break;
                    case 'dob':
                        state.dob = value;
                        break;
                    default:
                        console.log("no case defined for", { fieldName, value });
                        break;
                }
            }
            
        },
        clear: (state) => {
            console.log('CLEAR PROFILE')
            state.status = ''
            state.name = ''
            state.avatar = ''
            state.email = ''
            state.dob = ''
            state.username = ''
            state.user_id = 0
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProfileAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(getProfileAsync.fulfilled, (state, action:PayloadAction<any>) => {
            state.status = 'ok';
            state.username = action.payload.username;
            state.user_id = action.payload.user_id;
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
            state = {... initialState, status: "ok" };
            // console.log(action.payload);
        })
        .addCase(setProfileAsync.rejected, (state, action:PayloadAction<any>) =>{
            // console.log(action.payload);
            state = {... initialState, status: "failed" };
        })

    }

});

const selectProfile = (state:RootState) => state.profile;

export const selectors = {
    selectProfile
};

const { clear, setField } = profileSlice.actions;
export const actions = { 
    clear,
    setField
};


export default profileSlice.reducer;
