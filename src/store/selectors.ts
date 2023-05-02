import { useCallback } from 'react';
import { RootState } from '@store';
import { TRACK_RECORD_TTL } from '@utils/constants';
import { FindTrackFilter, findTrack } from '@utils/lfm/find-track';
import { Race } from './types';

export const userSelector = (state: RootState) => state.user.data;

export const settingsSelector = (state: RootState) => state.settings;

export const currentPageSelector = (state: RootState) => state.page;

export const tracksSelector = (state: RootState) => state.tracks;

export const isTrackDataUpToDateSelector = (state: RootState) => {
  const { updatedOn } = state.tracks;
  if (!updatedOn) return false;
  const now = Date.now();
  const updated = new Date(updatedOn);
  return now - updated.getTime() < TRACK_RECORD_TTL;
};

export const useTrackSelector = (filter: FindTrackFilter | undefined) =>
  useCallback(
    (state: RootState) =>
      filter ? findTrack(state.tracks.data, filter) : undefined,
    [filter]
  );

export const userTrackRecordsSelector = (state: RootState) =>
  state.userTrackRecords;

export const useRaceSelector = (raceId: Race['raceId']) =>
  useCallback((state: RootState) => state.races.data[raceId], [raceId]);
