import { TrackData } from '@store/types';

interface FindTrackFilter {
  simId?: TrackData['simId'];
  trackId?: TrackData['trackId'];
  trackYear?: TrackData['trackYear'];
  trackName?: TrackData['trackName'];
}

export function findTrack<Data extends TrackData>(
  tracks: Data[],
  { simId, trackId, trackYear, trackName }: FindTrackFilter
): Data | undefined {
  return tracks.find(
    (track) =>
      (simId === undefined || track.simId === simId) &&
      (trackId === undefined || track.trackId === trackId) &&
      (trackYear === undefined || track.trackYear === trackYear) &&
      (trackName === undefined || track.trackName === trackName)
  );
}
