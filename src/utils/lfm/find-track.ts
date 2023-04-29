import { TrackData } from '@store/types';

export function findTrack(
  tracks: TrackData[],
  simId: TrackData['simId'],
  trackId: TrackData['trackId'],
  trackYear: TrackData['trackYear']
) {
  return tracks.find(
    (track) =>
      track.simId === simId &&
      track.trackId === trackId &&
      track.trackYear === trackYear
  );
}
