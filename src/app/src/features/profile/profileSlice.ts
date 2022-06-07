import { createSlice, PayloadAction, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';
import api from '../network/api';
// import axios from 'axios';
import { RootState } from '../../memory/store'
import { persistedStore } from '../../memory/persist';

export const getProfileAsync = createAsyncThunk(
    'profile/get',
    async (params: any, thunkAPI) => {
        const state: any = thunkAPI.getState();
        const token = state?.auth?.token;
        const socketPath = {
            '/api/profile': {
                event: 'api:profile'
            },
        };
        const apiClient = new api({ token, socket: params.socket, socketPath });
        const response: any = await apiClient.get('/api/profile'); // pending
        return response.data; // fulfilled
    }
);



export async function uploadToS3(file: string, signedRequest: string) {
    let headers = { 'Content-Type': "x-www-form-urlencoded" }; //"multipart/form-data" };
    let method = "PUT";
    let match = /^data:(.*);base64,(.*)$/.exec(file);
    if (match == null) {
        // not base64 encoded ?
        throw 'Could not parse result'; // should not happen
    }
    // Split into two parts
    const parts = file.split(';base64,');
    // Hold the content type
    const imageType = parts[0].split(':')[1];
    // Decode Base64 string
    const decodedData = atob(parts[1]);
    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);
    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
        uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // Return BLOB image after conversion
    let image = new Blob([uInt8Array], { type: imageType });
    let body = image;
    // UPLOAD
    return await fetch(signedRequest, { method, body, headers });
}

export const setProfileAsync = createAsyncThunk(
    'profile/set',
    async (params: any, thunkAPI) => {
        const state: any = thunkAPI.getState();
        const { socket } = params;
        const token = socket?.auth?.token || state?.auth?.token;
        const { name, email, dob, avatar, username } = state.profile;
        const apiClient = new api({ token }); // legacy mode
        // * upload to s3
        let fileType = 'image/jpeg';
        const getSigned = await apiClient.get(`/api/aws/sign-s3?file-name=${username}-avatar.jpeg&file-type=${fileType}`);
        const { signedURL } = getSigned.data;
        await uploadToS3(avatar, signedURL);
        let imageURL = signedURL.split('?')[0];
        // ** update profile with s3 URL
        const updatedProfile = {
            name,
            avatar: imageURL,
            email,
            dob
        };
        await apiClient.put('/api/profile', updatedProfile); // pending
        return updatedProfile; // fulfilled
    }
);

export interface profileStore {
    username: string;
    user_id: number;
    name: string | undefined;
    avatar: string | undefined;
    email: string | undefined;
    dob: string | Date | undefined;
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
        updateProfile: (state, action:PayloadAction<any>) => {
            for (let fieldName of Object.keys(action.payload)) {
                let value = action.payload[fieldName];
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
                    case 'username':
                    case 'created_at':
                        break;
                    default:
                        console.log("no case defined for", { fieldName, value });
                        break;
                }
            }   
        },
        setField: (state, action: PayloadAction<any>) => {
            state.status = 'setField, pending';
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
                        // console.log("no case defined for", { fieldName, value });
                        break;
                }
            }

        },
        clear: (state) => {
            // console.log('CLEAR PROFILE');
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
            .addCase(getProfileAsync.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = 'ok';
                if (action.payload.username) {
                    state.username = action.payload.username;
                    state.user_id = action.payload.user_id;
                    state.name = action.payload.name;
                    state.avatar = action.payload.avatar;
                    state.email = action.payload.email;
                    state.dob = action.payload.dob;
                }
            })
            .addCase(getProfileAsync.rejected, (state, action: PayloadAction<any>) => {
                state = { ...initialState, status: "failed" };
            })

        builder.addCase(setProfileAsync.pending, (state) => {
            state.status = 'loading';
        })
            .addCase(setProfileAsync.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "ok";
                state.name = action.payload.name;
                state.email = action.payload.email;
                state.avatar = action.payload.avatar;
                state.dob = action.payload.dob;
            })
            .addCase(setProfileAsync.rejected, (state, action: PayloadAction<any>) => {
                // console.log(action.payload);
                state = { ...initialState, status: "failed" };
            })

    }

});

const selectProfile = (state: RootState) => state.profile;

export const selectors = {
    selectProfile
};

const { clear, setField, updateProfile } = profileSlice.actions;
export const actions = {
    clear,
    setField,
    updateProfile
};


export default profileSlice.reducer;
