import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RaceResultsSettings } from '@utils/lfm/create-race-results';

export interface SettingsState {
  ownSplitColor: string;
  ownNameColor: string;
  raceResults: RaceResultsSettings;
}

const initialState: SettingsState = {
  ownSplitColor: '#004eff',
  ownNameColor: '#004eff',
  raceResults: {
    joinWith: '\t',
    fields: [
      'raceUrl',
      'raceStartTime',
      'trackName',
      'carName',
      'ownSplitAndTotal',
      'qualiTime',
      'qualiTimePctg',
      'raceTime',
      'raceLaps',
      'raceAvgLapTime',
      'raceAvgLapTimePctg',
      'raceBestLapTime',
      'raceBestLapTimePctg',
      'startPosition',
      'endPosition',
      'incidentPoints',
      'srDelta',
      'eloDelta',
      { text: '0.00' },
      { text: '0' },
    ],
  },
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { setSettings } = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
