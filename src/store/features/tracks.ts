import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TrackDataWithRecords } from '@store/types';

interface TracksState {
  updatedOn?: string;
  data: TrackDataWithRecords[];
}

const initialState: TracksState = {
  data: [],
};

export const tracksSlice = createSlice({
  name: 'trackRecords',
  initialState,
  reducers: {
    setDataFromApi: (state, action: PayloadAction<TrackDataWithRecords[]>) => {
      for (const track of action.payload) {
        const index = state.data.findIndex(
          ({ simId, trackId }) =>
            simId === track.simId && trackId === track.trackId
        );
        if (index === -1) {
          state.data.push(track);
        } else {
          state.data.splice(index, 1, track);
        }
      }
      state.updatedOn = new Date().toISOString();
    },
  },
});

export const { setDataFromApi } = tracksSlice.actions;

export const tracksReducer = tracksSlice.reducer;
