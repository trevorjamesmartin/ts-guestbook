import { createSlice, PayloadAction, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';
import api from '../network/api';
import { RootState } from '../../memory/store'
import { persistedStore } from '../../memory/persist';

export const getFeedAsync = createAsyncThunk(
    'feed/get',
    async (_, thunkAPI) => {
        const state: any = thunkAPI.getState();
        const token = state?.auth?.token || undefined;
        const response = await new api(token).get('/api/feed'); // pending
        return response.data; // fulfilled
    }
);
interface PaginatedFeed { next: { page: number; limit: number; } | undefined, previous: { page: number; limit: number; } | undefined, pages: any[] }

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
interface Feed extends PaginatedFeed {
    status: string;
}

const clearState: Feed = {
    pages: [],
    next: undefined,
    previous: undefined,
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
            .addCase(getFeedAsync.fulfilled, (state, action: PayloadAction<PaginatedFeed>) => {
                state.status = 'ok';
                state.pages = action.payload.pages;
                state.previous = action.payload.previous;
                state.next = action.payload.next;
            })
            .addCase(getFeedAsync.rejected, (state, action: PayloadAction<any>) => {
                console.log("REJECTED!", action.payload);
                state.pages = [];
                state.previous = undefined;
                state.next = undefined;
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
