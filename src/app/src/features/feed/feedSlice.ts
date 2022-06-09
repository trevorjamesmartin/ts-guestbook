import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../network/api';
import { RootState } from '../../memory/store'
import { persistedStore } from '../../memory/persist';
import { Paginated } from '../pagination';

export const getFeedAsync = createAsyncThunk(
  'feed/get',
  async (params: any, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const token = state?.auth?.token;
    const { page, socket } = params;
    const socketPath = {
      '/api/feed': {
        event: "api:feed"
      }
    }
    const apiClient = new api({ token, socket, socketPath });
    const { protocol, pathname, host } = window.location;
    let searchString = '';
    let response: any = !page ?
      await apiClient.get('/api/feed', { params: { limit: 4 } }) :
      await apiClient.get('/api/feed', { params: { ...params, limit: 4 } });
    if (page > 1 && response.status === 200) {
      searchString = `?page=${page}`;
    }
    let url = `${protocol}//${host}${pathname}${searchString}`;
    window.history.pushState({}, '', url);
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
interface Feed extends Paginated {
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
    },
    update: (state, action:PayloadAction<Paginated>) => {
      state.status = 'ok';
      state.pages = action.payload.pages;
      state.next = action.payload.next;
      state.previous = action.payload.previous;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getFeedAsync.pending, (state) => {
      state.status = 'loading';
    })
      .addCase(getFeedAsync.fulfilled, (state, action: PayloadAction<Paginated>) => {
        state.status = 'ok';
        if (action.payload.pages.length > 0) {
          state.pages = action.payload.pages;
          state.previous = action.payload.previous;
          state.next = action.payload.next;
        }
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

const { clear, update } = profileSlice.actions;
export const actions = {
  clear,
  update,
  selectFeed
};


export default profileSlice.reducer;
