import { useCallback } from 'react';
import { RootState } from '@store';
import { FindTrackFilter, findTrack } from '@utils/lfm/find-track';
import { Race } from './types';

export const userSelector = (state: RootState) => state.user.data;

export const settingsSelector = (state: RootState) => state.settings;

export const currentPageSelector = (state: RootState) => state.page;

export const tracksSelector = (state: RootState) => state.tracks;

export const useTrackSelector = (filter: FindTrackFilter | undefined) =>
  useCallback(
    (state: RootState) =>
      filter ? findTrack(state.tracks.data, filter) : undefined,
    [filter]
  );

export const userTrackRecordsSelector = (state: RootState) =>
  state.userTrackRecords;

export const useRaceSelector = (raceId: Race['raceId'] | undefined) =>
  useCallback((state: RootState) => state.races.data[raceId!], [raceId]);

export const snackBarSelector = (state: RootState) => state.snackbar[0];
