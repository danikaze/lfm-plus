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
  name: 'racesState',
  initialState,
  reducers: {
    setDataFromApi: (state, action: PayloadAction<Race>) => {
      state.data[action.payload.raceId] = action.payload;
      state.updatedOn = new Date().toISOString();
    },
  },
});

export const { setDataFromApi } = racesSlice.actions;

export const racesReducer = racesSlice.reducer;
