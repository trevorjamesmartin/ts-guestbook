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
        const { content, id, tags, title } = state.posts.current;
        const response = await api(token).post('/api/posts', { content, id, tags, title });
        return response.data;
    }
);

// todo
export const replyPostAsync = createAsyncThunk(
    'posts/reply',
    async (id: number, thunkAPI) => {
        const state: any = thunkAPI.getState();
        const token = state?.auth?.token || undefined;
        const { content } = state.posts.current;
        const response = await api(token).post(`/api/posts/reply/${id}`, {
            content
        });
        return response.data;
    }
);

export interface BlogPost {
    id: number;
    title: string;
    tags: string;
    content: any;
}

type ListedPosts = BlogPost[];

export interface postsStore {
    current: BlogPost;
    listed: ListedPosts;
    pending: any[];
    status: string;
}

const clearState: postsStore = {
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

const initialState: postsStore = persistedStore?.posts || clearState

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
            .addCase(submitPostAsync.fulfilled, (state, action: PayloadAction<any>) => {
                console.log(action.payload);
                state.status = 'ok'
                // state.listed = [...state.listed, action.payload];
                state.current = clearState.current;
            })
            .addCase(submitPostAsync.rejected, (state, action: PayloadAction<any>) => {
                console.log(action.payload);
                state.status = 'failed';
            })
        builder.addCase(replyPostAsync.pending, (state) => {
            state.status = 'pending';
        })
            .addCase(replyPostAsync.fulfilled, (state, action: PayloadAction<any>) => {
                console.log(action.payload);
                state.status = 'ok'
                // state.listed = [...state.listed, action.payload];
                state.current = clearState.current;
            })
            .addCase(replyPostAsync.rejected, (state, action: PayloadAction<any>) => {
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
