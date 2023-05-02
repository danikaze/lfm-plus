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
    setDataFromApi: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
      state.updatedOn = new Date().toISOString();
    },
  },
});

export const { setDataFromApi } = userSlice.actions;

export const userReducer = userSlice.reducer;
