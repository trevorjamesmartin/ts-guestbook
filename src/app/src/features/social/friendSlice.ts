import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../network/api';
import { RootState } from '../../memory/store'

export const friendListAsync = createAsyncThunk(
  'friends/list',
  async (_, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const token = state?.auth?.token || undefined;
    const response =await new api(token).get('/api/friends'); // pending
    return response.data; // fulfilled
  }
);

export const friendRequestAsync = createAsyncThunk(
  'friends/request',
  async (user: any, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const token = state?.auth?.token || undefined;
    const response =await new api(token).post('/api/connect', {
      username: user.username
    }); // pending
    const result: requestPayload = {
      request_to: user,
      data: response.data // fulfilled 
    }
    return result;
  }
);

export const friendCheckAsync = createAsyncThunk(
  'friends/check',
  async (_, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const token = state?.auth?.token || undefined;
    const response =await new api(token).get('/api/friends/check'); // pending
    return response.data; // fulfilled
  }
);

export const acceptFriendRequestAsync = createAsyncThunk(
  'friends/accept',
  async (connect_id: number, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const token = state?.auth?.token || undefined;
    const response =await new api(token).post('/api/connect/accept', {
      connect_id
    }); // pending
    const result:any = {
      connect_id,
      data: response.data // fulfilled 
    }

    return result; // fulfilled
  }
);

export const rejectFriendRequestAsync = createAsyncThunk(
  'friends/reject',
  async (connect_id: number, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const token = state?.auth?.token || undefined;
    const response =await new api(token).post('/api/connect/reject', {
      connect_id
    }); // pending
    return response.data; // fulfilled
  }
);

export interface friendRequest {
  connect_id: number,
  username: string,
  name: string | undefined,
  avatar: string | undefined,
  email: string | undefined,
  dob: string | undefined
}

interface requestPayload {
  request_to: Partial<friendRequest>,
  data: any,
  [key:string]:any,
}

interface initialType {
  list: any[],
  incoming: any [],
  outgoing: any[],
  status: string
}

const clearState:initialType = {
  list: [],
  incoming: [],
  outgoing: [],
  status: ''
};

export const userSlice = createSlice({
  name: 'friends',
  initialState: clearState,
  reducers: {
    clear: (state) => {
      state.list = clearState.list;
      state.incoming = clearState.incoming;
      state.outgoing = clearState.outgoing;
    }
  },
  extraReducers: (builder) => {
    // LIST
    builder.addCase(friendListAsync.pending, (state) => {
      state.status = 'loading';
    })
      .addCase(friendListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'idle';
        state.list = action.payload;
      })
      .addCase(friendListAsync.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.list = [];
      });
    // REQUEST
    builder.addCase(friendRequestAsync.pending, (state) => {
      state.status = 'loading';
    })
      .addCase(friendRequestAsync.fulfilled, (state, action: PayloadAction<requestPayload>) => {
        state.status = 'idle';
        const { data, request_to } = action.payload;
        let connect_id;
        // const [connect_id] = data;
        if (Array.isArray(data)) {
          [connect_id] = data;
        } else {
          connect_id = data?.id;
        }
        const outgoing_request = { ...request_to, connect_id };
        state.outgoing = [...state.outgoing, outgoing_request];
      })
      .addCase(friendRequestAsync.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
      });
    // CHECK
    builder.addCase(friendCheckAsync.pending, (state) => {
      state.status = 'loading';
    })
      .addCase(friendCheckAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'idle';
        state.incoming = action.payload.requests;
        state.list = action.payload.friends;
      })
      .addCase(friendCheckAsync.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.incoming = [];
      });

    // ACCEPT
    builder.addCase(acceptFriendRequestAsync.pending, (state) => {
      state.status = 'loading';
    })
      .addCase(acceptFriendRequestAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'idle';
        const { connect_id, data } = action.payload;
        state.incoming = state.incoming.filter(req => req.connect_id !== connect_id);
      })
      .addCase(acceptFriendRequestAsync.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
      });

    // REJECT
    builder.addCase(rejectFriendRequestAsync.pending, (state) => {
      state.status = 'loading';
    })
      .addCase(rejectFriendRequestAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'idle';
      })
      .addCase(rejectFriendRequestAsync.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
      });


  }

});

const selectFriendList = (state: RootState) => state.friends.list;
const selectRequestsRecieved = (state: RootState) => state.friends.incoming;
const selectRequestsSent = (state: RootState) => state.friends.outgoing;
const selectStatus = (state: RootState) => state.friends.status;

export const selectors = {
  selectFriendList,
  selectRequestsRecieved,
  selectRequestsSent,
  selectStatus
};

const { clear } = userSlice.actions;
export const actions = {
  clear
};

export default userSlice.reducer;
