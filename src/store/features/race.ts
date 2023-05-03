import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Race } from '@store/types';

interface RacesState {
  updatedOn?: string;
  data: Partial<Record<Race['raceId'], Race>>;
}

const initialState: RacesState = {
  data: {},
};

export const racesSlice = createSlice({
  name: 'races',
  initialState,
  reducers: {
    setRacesDataFromApi: (state, action: PayloadAction<Race>) => {
      state.data[action.payload.raceId] = action.payload;
      state.updatedOn = new Date().toISOString();
    },
  },
});

export const { setRacesDataFromApi } = racesSlice.actions;

export const racesReducer = racesSlice.reducer;
