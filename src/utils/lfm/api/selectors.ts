import { QualiResult, Race, RaceResult, User } from '@store/types';
import { CarClass } from '..';

export function getQualiResultFromRaceData(
  race: Race | undefined,
  userId: User['id'] | undefined,
  split?: number
): QualiResult | undefined {
  if (!race || !userId) return;
  if (split !== undefined) {
    return race.qualiResults.find((result) => result.userId === userId);
  }
  for (const splitResult of race.qualiResultsSplits) {
    const result = findQualiResult(splitResult, userId);
    if (result) return result;
  }
}

export function getRaceResultFromRaceData(
  race: Race | undefined,
  userId: User['id'] | undefined,
  split?: number
): RaceResult | undefined {
  if (!race || !userId) return;
  if (split !== undefined) {
    return findRaceResultFromRaceData(race.raceResultsSplits[split], userId);
  }
  for (const splitResult of race.raceResultsSplits) {
    const result = findRaceResultFromRaceData(splitResult, userId);
    if (result) return result;
  }
}

function findQualiResult(
  qualiResultsSplits: QualiResult[],
  userId: User['id']
): QualiResult | undefined {
  return qualiResultsSplits.find((result) => result.userId === userId);
}

function findRaceResultFromRaceData(
  raceResults: Record<CarClass, Record<'OVERALL', RaceResult[]>>,
  userId: User['id']
): RaceResult | undefined {
  const entries = Object.values(raceResults);
  for (const carClassResults of entries) {
    for (const results of Object.values(carClassResults)) {
      const userResult = results.find((result) => result.userId === userId);
      if (userResult) return userResult;
    }
  }
}
