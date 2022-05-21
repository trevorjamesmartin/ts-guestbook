import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../network/api';
import { RootState } from '../../memory/store'
import { Paginated } from '../pagination';

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
  async (params: any, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const token = state?.auth?.token;
    const apiClient = new api(token);
    const { protocol, pathname, host } = window.location;
    let searchString = '';
    const { page } = params;
    let response: any = !page ?
      await apiClient.get('/api/users/with-profiles', { params: { page: 1, limit: 9 } }) :
      await apiClient.get('/api/users/with-profiles', { params: { page, limit: 9 } });
    // console.log(response)
    if (page > 1 && response.status === 200) {
      searchString = `?page=${page}`;
    }
    let url = `${protocol}//${host}${pathname}${searchString}`;
    window.history.pushState({}, '', url);
    return response.data; // fulfilled
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
    },
    updateUsers: (state, action: PayloadAction<UserList>) => {
      state.status = 'ok';
      state.pages = action.payload.pages;
      state.previous = action.payload.previous;
      state.next = action.payload.next;
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
  }
});

const selectList = (state: RootState) => state.users;

const selectStatus = (state: RootState) => state.users.status;

export const selectors = {
  selectList, selectStatus
};

const { clear, updateUsers } = userSlice.actions;

export const actions = {
  clear,
  updateUsers
};

export default userSlice.reducer;
