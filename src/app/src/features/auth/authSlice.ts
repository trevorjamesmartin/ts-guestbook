import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../memory/store';
import { persistedStore } from '../../memory/persist';
import api from '../api';

export interface Credentials {
  username: string;
  password: string;
}

interface credStatus {
  message: string | undefined;
  loggedIn: boolean;
  status: 'idle' | 'loading' | 'failed' | 'registered';
}

export const initialCreds: credStatus = {
  message: "",
  loggedIn: false,
  status: 'idle'
}

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (data: Credentials) => {
    const response = await api.post('/auth/login', data); // pending
    return response.data; // fulfilled
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (data: Credentials) => {
    const response = await api.post('auth/register', data); // pending
    return response.data; // fulfilled
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: persistedStore?.auth || initialCreds,
  reducers: {
    logout: (state) => {
      state.loggedIn = false;
      state.message = "Goodbye!";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.status = 'loading';
        state.loggedIn = false;
        state.message = '';
      })
      .addCase(loginAsync.fulfilled, (state, action:PayloadAction<any>) => {
        state.status = 'idle';
        state.message = action.payload.message;
        state.loggedIn = true;
      })
      .addCase(loginAsync.rejected, (state, action:PayloadAction<any>) => {
        state.status = 'failed';
        state.message = '';
        state.loggedIn = false;
      })
    
    builder
      .addCase(registerAsync.pending, (state) => {
        state.status = 'loading';
        state.loggedIn = false;
        state.message = '';
        console.log('[register ...]');
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.status = 'registered';
        state.loggedIn = false;
        console.log("[register SUCCESS]")
      })
      .addCase(registerAsync.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.message = '';
        state.loggedIn = false;
        console.log("[register FAIL!]", action);
      })
  }

});

const { logout } = authSlice.actions;

export const actions = { logout }

const selectLoggedIn = (state:RootState) => state.auth.loggedIn;
const selectStatus = (state:RootState) => state.auth.status;
const selectMessage = (state:RootState) => state.auth.message;

export const selectors = {
  selectLoggedIn,
  selectStatus,
  selectMessage
}

const isLoggedIn = ():AppThunk => (
  _, // dispatch
  getState
) => {
  return selectLoggedIn(getState());
}

const status = ():AppThunk => (
  _, 
  getState
) => {
  return selectStatus(getState());
}

const message = ():AppThunk => (
  _,
  getState
) => {
  return selectMessage(getState());
}

export const thunks = { isLoggedIn, status, message }

export default authSlice.reducer;
