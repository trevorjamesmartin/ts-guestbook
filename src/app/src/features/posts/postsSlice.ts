import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';
import { RootState } from '../../memory/store';
import { persistedStore } from '../../memory/persist';

export const getPostsAsync = createAsyncThunk(
    'posts/get',
    async (_, thunkAPI) => {
        const state: any = thunkAPI.getState();
        const token = state?.auth?.token || undefined;
        const response = await api(token).get('/api/posts');
        return response.data;
    }
);

export const submitPostAsync = createAsyncThunk(
    'posts/submit',
    async (_, thunkAPI) => {
        const state: any = thunkAPI.getState();
        const token = state?.auth?.token || undefined;
        const response = await api(token).post('/api/posts', state.posts.current);
        return response.data;
    }
);

export interface BlogPost {
    id: number;
    title: string;
    tags: string;
    content: JSON;
}

type ListedPosts = BlogPost[];

export interface postsStore {
    current: BlogPost;
    listed: ListedPosts;
    pending: any[];
    status: string;
}

const clearState = {
    current: {
        id: 0,
        title: '',
        tags: '',
        content: ''
    },
    listed: [],
    pending: [],
    status: ''
};

const initialState = persistedStore?.posts || clearState

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        clear: (state) => {
            state = { ...clearState }
        },
        setCurrent: (state, action: PayloadAction<Partial<BlogPost>>) => {
            state.current = { ...state.current, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getPostsAsync.pending, (state) => {
            state.status = 'pending';
        })
            .addCase(getPostsAsync.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = 'ok';
                state.listed = action.payload;
            })
            .addCase(getPostsAsync.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed'
                state.listed = [];
            });
        builder.addCase(submitPostAsync.pending, (state) => {
            state.status = 'pending';
        })
        .addCase(submitPostAsync.fulfilled, (state, action:PayloadAction<any>) => {
            console.log(action.payload);
            state.status = 'ok'
            state.listed = [...state.listed, action.payload];
            state.current = clearState.current;
        })
        .addCase(submitPostAsync.rejected, (state, action:PayloadAction<any>) => {
            console.log(action.payload);
            state.status = 'failed';
        })
    }
});

const selectPosts = (state: RootState) => state.posts.listed;
const selectCurrent = (state: RootState) => state.posts.current;
export const selectors = {
    selectPosts,
    selectCurrent
};

const { clear, setCurrent } = postsSlice.actions;

export const actions = {
    clear,
    setCurrent
}

export default postsSlice.reducer;
