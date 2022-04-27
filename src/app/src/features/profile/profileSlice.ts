import { createSlice, PayloadAction, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';
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
    async (data:any) => {
      console.log({data});
      const {status, ...profileData } = data; // separate status from profile data;
      const response = await api.put('/api/profile', profileData); // pending
      return response.data; // fulfilled
    }
);


const initialState = {
    name: '',
    avatar: '',
    email: '',
    dob: undefined,
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
            state = {...initialState };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProfileAsync.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(getProfileAsync.fulfilled, (state, action:PayloadAction<any>) => {
            state.status = 'ok';
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
            state.status = 'ok';
            console.log(action.payload);
        })
        .addCase(setProfileAsync.rejected, (state, action:PayloadAction<any>) =>{
            console.log(action.payload);
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
