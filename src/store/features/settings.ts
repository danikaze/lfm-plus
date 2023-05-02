import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface SettingsState {
  ownSplitColor: string;
  ownNameColor: string;
}

const initialState: SettingsState = {
  ownSplitColor: '#004eff',
  ownNameColor: '#004eff',
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
