import { createSlice, PayloadAction, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';
import api from '../network/api';
import { RootState } from '../../memory/store'
import { persistedStore } from '../../memory/persist';

export const getFeedAsync = createAsyncThunk(
    'feed/get',
    async (_, thunkAPI) => {
        const state: any = thunkAPI.getState();
        const token = state?.auth?.token || undefined;
        const response =await new api(token).get('/api/feed'); // pending
        return response.data; // fulfilled
    }
);

export interface Food {
    id: number;
    author_id: number;
    title: string;
    tags: string;
    content: JSON;
    posted_at: any;
    parent_id: number;
    thread_id: number;
    created_at: any;
    username: any;
    avatar: any;
    name: any;
}

interface Feed {
    food: Food[];
    status: string;
}

const clearState = {
    food: [],
    status: ""
};
const initialState: Feed = persistedStore?.feed || clearState;

export const profileSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        clear: (state) => {
            state = clearState;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getFeedAsync.pending, (state) => {
            state.status = 'loading';
        })
            .addCase(getFeedAsync.fulfilled, (state, action: PayloadAction<Food|Food[]>) => {
                state.status = 'ok';
                if (Array.isArray(action.payload)) {
                    state.food = action.payload;
                } else {
                    console.log("ERROR", action.payload)
                    state.food = [];
                }
            })
            .addCase(getFeedAsync.rejected, (state, action: PayloadAction<any>) => {
                console.log("REJECTED!", action.payload);
                state.food = [];
                state.status = "failed"
            })


    }

});

const selectFeed = (state: RootState) => state.feed;

export const selectors = {
    selectFeed
};

const { clear } = profileSlice.actions;
export const actions = {
    clear,
    selectFeed
};


export default profileSlice.reducer;
