import { configureStore } from '@reduxjs/toolkit';

import { tracksReducer } from './features/tracks';
import { pageReducer } from './features/page';

export const store = configureStore({
  reducer: {
    page: pageReducer,
    tracks: tracksReducer,
  },
});

export type Store = typeof store;
export type RootState = ReturnType<Store['getState']>;
export type AppDispatch = Store['dispatch'];
