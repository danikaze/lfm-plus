import { configureStore } from '@reduxjs/toolkit';

import { tracksReducer } from './features/tracks';

export const store = configureStore({
  reducer: {
    tracks: tracksReducer,
  },
});

export type Store = typeof store;
export type RootState = ReturnType<Store['getState']>;
export type AppDispatch = Store['dispatch'];
