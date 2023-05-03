import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TrackDataWithRecordsOneClass } from '@store/types';
import { CarClass } from '@utils/lfm';

interface TracksState {
  updatedOn?: string;
  data: Partial<Record<CarClass, TrackDataWithRecordsOneClass[]>>;
}

interface PayloadData {
  carClass: CarClass;
  tracks: TrackDataWithRecordsOneClass[];
}

const initialState: TracksState = {
  data: {},
};

export const userTrackRecordsSlice = createSlice({
  name: 'userTrackRecords',
  initialState,
  reducers: {
    setUserTrackRecordsDataFromApi: (
      state,
      action: PayloadAction<PayloadData>
    ) => {
      const { carClass, tracks } = action.payload;
      if (!state.data[carClass]) {
        state.data[carClass] = [];
      }
      const data = state.data[carClass]!;

      for (const track of tracks) {
        const index = data.findIndex(
          ({ simId, trackId }) =>
            simId === track.simId && trackId === track.trackId
        );
        if (index === -1) {
          data.push(track);
        } else {
          data.splice(index, 1, track);
        }
      }
      state.updatedOn = new Date().toISOString();
    },
  },
});

export const { setUserTrackRecordsDataFromApi } = userTrackRecordsSlice.actions;

export const userTrackRecordsReducer = userTrackRecordsSlice.reducer;
