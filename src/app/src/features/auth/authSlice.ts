import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../memory/store';
import { persistedStore } from '../../memory/persist';
// import bcrypt from 'bcryptjs';
import api from '../network/api';

export interface Credentials {
  username: string;
  password: string;
  socket?:any;
}

interface credStatus {
  message: string | undefined;
  loggedIn: boolean;
  token: string | undefined;
  status: 'idle' | 'loading' | 'failed' | 'registered' | '';
}

export const initialCreds: credStatus = {
  message: "",
  loggedIn: false,
  status: 'idle',
  token: undefined
}

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (data: Credentials, thunkAPI) => {
    const state:any = thunkAPI.getState();
    const token = state?.auth?.token || undefined;
    const response = await new api({ token, socket: data.socket }).post('/auth/login', data); // pending
    return response.data; // fulfilled
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    const state:any = thunkAPI.getState();
    const token = state?.auth?.token || undefined;
    const response =await new api(token).delete('/auth/logout'); // pending
    return response.data; // fulfilled
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (data: Credentials, thunkAPI) => {
    const state:any = thunkAPI.getState();
    const token = state?.auth?.token || undefined;
    const response =await new api(token).post('auth/register', data); // pending
    return response.data; // fulfilled
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: persistedStore?.auth || initialCreds,
  reducers: {
    // logout: (state) => {
    //   state.loggedIn = false;
    //   state.message = "Goodbye!";
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.status = 'loading';
        state.message = '';
        state.loggedIn = false;
      })
      .addCase(loginAsync.fulfilled, (state, action:PayloadAction<any>) => {
        state.status = 'idle';
        state.message = action.payload.message;
        state.loggedIn = true;
        state.token = action.payload.token; // set token
      })
      .addCase(loginAsync.rejected, (state, action:PayloadAction<any>) => {
        state.status = 'failed';
        state.message = '';
        state.token = undefined;
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
    
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.status = 'loading';
        state.message = 'logging out...';
        console.log('[logging out]');
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.status = '';
        state.message = 'Goodbye!';
        state.token = undefined; // clear token
        state.loggedIn = false;
        console.log('[logged out!');
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.status = 'failed';
        state.message = 'error logging out';
        state.token = undefined; // clear token
        state.loggedIn = false;
        console.log("[error logging out!]")
      })

  }

});

// const { logout } = authSlice.actions;

// export const actions = { logout }

const selectLoggedIn = (state:RootState) => state.auth.loggedIn;
const selectStatus = (state:RootState) => state.auth.status;
const selectMessage = (state:RootState) => state.auth.message;
const selectToken = (state:RootState) => state.auth.token;

export const selectors = {
  selectLoggedIn,
  selectStatus,
  selectMessage,
  selectToken
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
