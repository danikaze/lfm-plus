import { RootState } from '@store';
import { TRACK_RECORD_TTL } from '@utils/constants';
import { TrackData } from './types';

export const tracksSelector = (state: RootState) => state.tracks;

export const isTrackDataUpToDateSelector = (state: RootState) => {
  const { updatedOn } = state.tracks;
  if (!updatedOn) return false;
  const now = Date.now();
  const updated = new Date(updatedOn);
  return now - updated.getTime() < TRACK_RECORD_TTL;
};

export const getTrackSelector =
  (
    simId: TrackData['simId'],
    trackId: TrackData['trackId'],
    trackYear: TrackData['trackYear']
  ) =>
  (state: RootState) =>
    state.tracks.data.find(
      (track) =>
        track.simId === simId &&
        track.trackId === trackId &&
        track.trackYear === trackYear
    );
