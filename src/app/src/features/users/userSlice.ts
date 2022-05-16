import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../network/api';
import { RootState } from '../../memory/store'
import { Paginated } from '../Pagination';

interface UserList extends Paginated {
  status: string;
}
const clearState: UserList = {
  pages: [],
  next: undefined,
  previous: undefined,
  status: ""
};

export const usersAsync = createAsyncThunk(
  'users/list',
  async (_, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const token = state?.auth?.token || undefined;
    const apiClient = new api(token);
    const response = await apiClient.get('/api/users/with-profiles'); // pending
    console.log(response)
    return response.data; // fulfilled
  }
);
export const usersNextPageAsync = createAsyncThunk(
  'users/page-next',
  async (key: string, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const token = state?.auth?.token || undefined;
    let rPath:string = '/api/users/with-profiles/';
    let pg;
    switch (key) {
      case 'next':
        pg = state.users.next.page;
        break;
      case 'previous':
        pg = state.users.previous.page;
        break;
      default:
        break;
    }
    if (pg) {
      rPath += `?page=${pg}`;
    } else {
      return state.users;
    }
    let apiClient = new api(token);
    console.log(key, rPath);
    const response = await apiClient.get(rPath); // pending
    if(response.status === 200) {
      return response.data; // fulfilled
    }
    console.log(response.status, rPath);
    return state.users;
  }

);

export const userSlice = createSlice({
  name: 'users',
  initialState: clearState,
  reducers: {
    clear: (state) => {
      state.status = clearState.status;
      state.pages = clearState.pages;
      state.next = clearState.next;
      state.previous = clearState.previous;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(usersAsync.pending, (state) => {
      state.status = 'loading';
    })
      .addCase(usersAsync.fulfilled, (state, action: PayloadAction<UserList>) => {
        state.status = 'ok';
        state.pages = action.payload.pages;
        state.previous = action.payload.previous;
        state.next = action.payload.next;
      })
      .addCase(usersAsync.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.pages = [];
      });

    builder.addCase(usersNextPageAsync.pending, (state) => {
      state.status = 'loading';
    })
      .addCase(usersNextPageAsync.fulfilled, (state, action: PayloadAction<UserList>) => {
        state.status = 'ok';
        state.pages = action.payload.pages;
        state.previous = action.payload.previous;
        state.next = action.payload.next;
      })
      .addCase(usersNextPageAsync.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.pages = [];
      });
  }

});

const selectList = (state: RootState) => state.users;
const selectStatus = (state: RootState) => state.users.status;
export const selectors = {
  selectList, selectStatus
};

const { clear } = userSlice.actions;
export const actions = {
  clear
};

export default userSlice.reducer;
