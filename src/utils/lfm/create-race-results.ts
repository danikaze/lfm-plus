import {
  QualiResult,
  Race,
  RaceResult,
  TrackDataWithRecordsAllClasses,
  User,
} from '@store/types';
import { msToTime, timeToMs } from '@utils/time';
import {
  getQualiResultFromRaceData,
  getRaceResultFromRaceData,
  getSplitSoF,
} from './api/accessors';
import { getPctgTime } from './get-time-pctg';
import { CarClass } from '.';
import { LAP_TIME_TO_COUNT_RANGE_MS } from '@utils/constants';

export interface RaceResultsSettings {
  joinWith: string;
  fields: RaceResultFields[];
}

export type RaceResultFields =
  | { text: string }
  | 'raceUrl'
  | 'raceStartTime'
  | 'trackName'
  | 'carName'
  | 'ownSplit'
  | 'ownSplitSoF'
  | 'splitsN'
  | 'ownSplitAndTotal'
  | 'qualiTime'
  | 'qualiTimePctg'
  | 'raceTime'
  | 'raceLaps'
  | 'raceAvgLapTime'
  | 'raceAvgLapTimePctg'
  | 'raceBestLapTime'
  | 'raceBestLapTimePctg'
  | 'startPosition'
  | 'endPosition'
  | 'incidentPoints'
  | 'srBefore'
  | 'eloBefore'
  | 'srDelta'
  | 'eloDelta'
  | 'srAfter'
  | 'eloAfter'
  | 'carClass';

export function createRaceResults(
  settings: RaceResultsSettings,
  trackRecords: TrackDataWithRecordsAllClasses[],
  race: Race,
  userId: User['id']
): string | undefined {
  const qualiResult = getQualiResultFromRaceData(race, userId);
  const raceResult = getRaceResultFromRaceData(race, userId);
  const track = trackRecords.find(
    (track) => track.trackId === race.track.trackId
  );
  if (!race || !qualiResult || !raceResult) return;

  return settings.fields
    .map(
      (field) => getFieldData(track, race, qualiResult, raceResult, field) ?? ''
    )
    .join(settings.joinWith);
}

function getFieldData(
  track: TrackDataWithRecordsAllClasses | undefined,
  race: Race,
  qualiResult: QualiResult,
  raceResult: RaceResult,
  field: RaceResultFields
): string | number | undefined {
  if (typeof field !== 'string') {
    return field.text;
  }
  if (field === 'raceUrl') {
    return `https://lowfuelmotorsport.com/events/${race.eventId}/race/${race.raceId}`;
  }
  if (field === 'raceStartTime') {
    return formatDateInLocalTimezone(race.raceDate);
  }
  if (field === 'trackName') {
    return race.track.trackName;
  }
  if (field === 'carName') {
    return raceResult.carName;
  }
  if (field === 'ownSplit') {
    return raceResult.split + 1;
  }
  if (field === 'ownSplitSoF') {
    return getSplitSoF(race, raceResult.split);
  }
  if (field === 'splitsN') {
    return race.qualiResultsSplits.length;
  }
  if (field === 'ownSplitAndTotal') {
    return `${raceResult.split + 1}/${race.qualiResultsSplits.length}`;
  }
  if (field === 'qualiTime') {
    return qualiResult.bestLap;
  }
  if (field === 'qualiTimePctg') {
    const pctg = getPctgTime(
      raceResult.class,
      track?.records,
      qualiResult.bestLap
    );
    return pctg ? `${pctg.toFixed(2)}%` : undefined;
  }
  if (field === 'raceTime') {
    return raceResult.time;
  }
  if (field === 'raceLaps') {
    return raceResult.laps;
  }
  if (field === 'raceAvgLapTime') {
    return getAvgLapTime(raceResult);
  }
  if (field === 'raceAvgLapTimePctg') {
    const avg = getAvgLapTime(raceResult);
    const pctg = getPctgTime(raceResult.class, track?.records, avg);
    return pctg ? `${pctg.toFixed(2)}%` : undefined;
  }
  if (field === 'raceBestLapTime') {
    return raceResult.bestLap;
  }
  if (field === 'raceBestLapTimePctg') {
    const pctg = getPctgTime(
      raceResult.class,
      track?.records,
      raceResult.bestLap
    );
    return pctg ? `${pctg.toFixed(2)}%` : undefined;
  }
  if (field === 'startPosition') {
    return raceResult.position + raceResult.positionGain;
  }
  if (field === 'endPosition') {
    return raceResult.position;
  }
  if (field === 'incidentPoints') {
    return raceResult.incidents;
  }
  if (field === 'srBefore') {
    return raceResult.raceStartSr;
  }
  if (field === 'eloBefore') {
    return raceResult.raceStartElo;
  }
  if (field === 'srDelta') {
    return (
      raceResult.srChange ??
      (
        Number(raceResult.safetyRating) - Number(raceResult.raceStartSr)
      ).toFixed(2)
    );
  }
  if (field === 'eloDelta') {
    return (
      raceResult.ratingGain ?? raceResult.ccRating - raceResult.raceStartElo
    );
  }
  if (field === 'srAfter') {
    return raceResult.safetyRating;
  }
  if (field === 'eloAfter') {
    return raceResult.rating + raceResult.srChange;
  }
  if (field === 'carClass') {
    return raceResult.class;
  }
}

function getAvgLapTime(results: RaceResult): string | undefined {
  const bestLapMs = timeToMs(results.bestLap);
  if (!bestLapMs) return;
  const threshold = bestLapMs + LAP_TIME_TO_COUNT_RANGE_MS;

  const countingLaps = results.lapDetail
    .map((detail) => timeToMs(detail.lapTime))
    .filter((time) => time && time <= threshold) as number[];
  if (countingLaps.length === 0) return;

  const sumMs = countingLaps.reduce((sum, time) => sum + time, 0);
  return msToTime(sumMs / countingLaps.length);
}

function formatDateInLocalTimezone(
  lfmDate: string | undefined
): string | undefined {
  if (!lfmDate) return;
  const d = new Date(`${lfmDate} +01:00`);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().replace('Z', '');
}
