import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TrackDataWithRecordsAllClasses } from '@store/types';

interface TracksState {
  updatedOn?: string;
  data: TrackDataWithRecordsAllClasses[];
}

const initialState: TracksState = {
  data: [],
};

export const tracksSlice = createSlice({
  name: 'trackRecords',
  initialState,
  reducers: {
    setTrackRecordsDataFromApi: (
      state,
      action: PayloadAction<TrackDataWithRecordsAllClasses[]>
    ) => {
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

export const { setTrackRecordsDataFromApi } = tracksSlice.actions;

export const tracksReducer = tracksSlice.reducer;
