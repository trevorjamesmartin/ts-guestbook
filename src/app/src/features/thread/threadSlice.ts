import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../network/api';
import { RootState } from '../../memory/store';
import { persistedStore } from '../../memory/persist';

export const submitPostAsync = createAsyncThunk(
    'posts/submit',
    async (_, thunkAPI) => {
        const state: any = thunkAPI.getState();
        const token = state?.auth?.token || undefined;
        const { content, id, tags, title } = state.thread.current;
        const response = await new api(token).post('/api/posts', { content, id, tags, title });
        return response.data;
    }
);

// todo
export const replyPostAsync = createAsyncThunk(
    'posts/reply',
    async (id: number, thunkAPI) => {
        const state: any = thunkAPI.getState();
        const token = state?.auth?.token || undefined;
        console.log(state)
        const { content } = state.thread.current;
        const response = await new api(token).post(`/api/posts/reply/${id}`, {
            content
        });
        return response.data;
    }
);

export const getThreadAsync = createAsyncThunk(
    'posts/replies',
    async (id: number, thunkAPI) => {
        const state: any = thunkAPI.getState();
        const token = state?.auth?.token || undefined;
        const response = await new api(token).get(`/api/posts/thread/${id}`);
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
            for (let name of Object.keys(action.payload)) {
                switch (name) {
                    case 'content':
                        state.current.content = action.payload.content.slice(0, 254);
                        break;
                    default:
                        break;
                }
            }
            state.current = { ...state.current, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getThreadAsync.pending, (state) => {
            state.status = 'pending';
        })
            .addCase(getThreadAsync.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = 'ok';
                state.listed = action.payload;
            })
            .addCase(getThreadAsync.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed'
                state.listed = [];
                console.log(action.payload)
            });
        builder.addCase(submitPostAsync.pending, (state) => {
            state.status = 'pending';
        })
            .addCase(submitPostAsync.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = 'ok'
                state.current = clearState.current;
            })
            .addCase(submitPostAsync.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
            })
        builder.addCase(replyPostAsync.pending, (state) => {
            state.status = 'pending';
        })
            .addCase(replyPostAsync.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = 'ok'
                // state.listed = [...state.listed, action.payload];
                state.current = clearState.current;
            })
            .addCase(replyPostAsync.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
            })
    }
});

const selectListed = (state: RootState) => state.thread.listed;
const selectCurrent = (state: RootState) => state.thread.current;
export const selectors = {
    selectListed,
    selectCurrent
};

const { clear, setCurrent } = postsSlice.actions;

export const actions = {
    clear,
    setCurrent
}

export default postsSlice.reducer;