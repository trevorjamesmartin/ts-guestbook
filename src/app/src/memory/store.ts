import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import { toStorage, storageKey } from './persist';

export const store = configureStore({  
  reducer: {
    auth: authReducer,
    users: userReducer
  },
});

store.subscribe(() => {
  toStorage(store.getState(), storageKey);
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export default store
