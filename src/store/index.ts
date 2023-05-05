import { configureStore } from '@reduxjs/toolkit';

import { tracksReducer } from './features/tracks';
import { pageReducer } from './features/page';
import { userTrackRecordsReducer } from './features/user-track-records';
import { racesReducer } from './features/race';
import { settingsReducer } from './features/settings';
import { userReducer } from './features/user';
import { snackbarReducer } from './features/snackbar';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    user: userReducer,
    page: pageReducer,
    tracks: tracksReducer,
    userTrackRecords: userTrackRecordsReducer,
    races: racesReducer,
    snackbar: snackbarReducer,
  },
});

export type Store = typeof store;
export type RootState = ReturnType<Store['getState']>;
export type AppDispatch = Store['dispatch'];
