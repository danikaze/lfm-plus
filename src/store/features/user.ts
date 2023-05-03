import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from '@store/types';

interface UserState {
  updatedOn?: string;
  data?: User;
}

const initialState: UserState = {};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDataFromApi: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
      state.updatedOn = new Date().toISOString();
    },
  },
});

export const { setUserDataFromApi } = userSlice.actions;

export const userReducer = userSlice.reducer;
