export type ResultRowOrigin =
  | 'raceQualiResult'
  | 'raceResult'
  | 'raceEntryList';

export type LfmResultRow =
  | LfmQualiResultRow
  | LfmRaceResultRow
  | LfmEntrylistRow;

export type LfmQualiResultRow = Record<
  | 'endPosition'
  | 'originFlag'
  | 'driverName'
  | 'carNumber'
  | 'carModel'
  | 'bestLap'
  | 'nLaps'
  | 's1'
  | 's2'
  | 's3'
  | 'gap',
  HTMLTableCellElement
>;

export type LfmRaceResultRow = Record<
  | 'position'
  | 'originFlag'
  | 'driverName'
  | 'carNumber'
  | 'carModel'
  | 'bestLap'
  | 'nLaps'
  | 'raceTime'
  | 'gap'
  | 'posGain'
  | 'points'
  | 'laptimesButton',
  HTMLTableCellElement
>;

export type LfmEntrylistRow = Record<
  | 'position'
  | 'originFlag'
  | 'msgPatreon'
  | 'driverName'
  | 'teamName'
  | 'elo'
  | 'lfmLicense'
  | 'carModel'
  | 'livery'
  | 'sns',
  HTMLTableCellElement
>;

const enum QualiResultsColumns {
  POSITION = 0,
  ORIGIN_FLAG = 1,
  DRIVER_NAME = 2,
  CAR_NUMBER = 3,
  CAR_MODEL = 4,
  BEST_LAP = 5,
  N_LAPS = 6,
  S1 = 8,
  S2 = 9,
  S3 = 10,
  GAP = 11,
}
const enum RaceResultsColumns {
  POSITION = 0,
  ORIGIN_FLAG = 1,
  DRIVER_NAME = 2,
  CAR_NUMBER = 3,
  CAR_MODEL = 4,
  BEST_LAP = 5,
  N_LAPS = 6,
  RACE_TIME = 7,
  GAP = 8,
  POS_GAIN = 9,
  POINTS = 10,
  LAPTIMES_BUTTON = 11,
}
const enum EntrylistColumns {
  POSITION = 0,
  ORIGIN_FLAG = 1,
  MSG_PATREON = 2,
  DRIVER_NAME = 3,
  TEAM_NAME = 4,
  ELO = 5,
  LFM_LICENSE = 6,
  CAR_MODEL = 7,
  LIVERY = 8,
  SNS = 9,
}

export function isQualiResultRow(
  result: LfmResultRow
): result is LfmQualiResultRow {
  return (result as LfmQualiResultRow).s1 !== undefined;
}

export function isRaceResultRow(
  result: LfmResultRow
): result is LfmRaceResultRow {
  return (result as LfmRaceResultRow).raceTime !== undefined;
}

export function isEntrylistResultRow(
  result: LfmResultRow
): result is LfmEntrylistRow {
  return (result as LfmEntrylistRow).teamName !== undefined;
}

export function createResultRow(
  tr: HTMLTableRowElement,
  origin: ResultRowOrigin
): LfmResultRow {
  const tds = Array.from(tr.children) as HTMLTableCellElement[];
  if (origin === 'raceQualiResult') {
    return {
      endPosition: tds[QualiResultsColumns.POSITION],
      originFlag: tds[QualiResultsColumns.ORIGIN_FLAG],
      driverName: tds[QualiResultsColumns.DRIVER_NAME],
      carNumber: tds[QualiResultsColumns.CAR_NUMBER],
      carModel: tds[QualiResultsColumns.CAR_MODEL],
      bestLap: tds[QualiResultsColumns.BEST_LAP],
      nLaps: tds[QualiResultsColumns.N_LAPS],
      s1: tds[QualiResultsColumns.S1],
      s2: tds[QualiResultsColumns.S2],
      s3: tds[QualiResultsColumns.S3],
      gap: tds[QualiResultsColumns.GAP],
    };
  }

  if (origin === 'raceResult') {
    return {
      position: tds[RaceResultsColumns.POSITION],
      originFlag: tds[RaceResultsColumns.ORIGIN_FLAG],
      driverName: tds[RaceResultsColumns.DRIVER_NAME],
      carNumber: tds[RaceResultsColumns.CAR_NUMBER],
      carModel: tds[RaceResultsColumns.CAR_MODEL],
      bestLap: tds[RaceResultsColumns.BEST_LAP],
      nLaps: tds[RaceResultsColumns.N_LAPS],
      raceTime: tds[RaceResultsColumns.RACE_TIME],
      gap: tds[RaceResultsColumns.GAP],
      posGain: tds[RaceResultsColumns.POS_GAIN],
      points: tds[RaceResultsColumns.POINTS],
      laptimesButton: tds[RaceResultsColumns.LAPTIMES_BUTTON],
    };
  }

  return {
    position: tds[EntrylistColumns.POSITION],
    originFlag: tds[EntrylistColumns.ORIGIN_FLAG],
    msgPatreon: tds[EntrylistColumns.MSG_PATREON],
    driverName: tds[EntrylistColumns.DRIVER_NAME],
    teamName: tds[EntrylistColumns.TEAM_NAME],
    elo: tds[EntrylistColumns.ELO],
    lfmLicense: tds[EntrylistColumns.LFM_LICENSE],
    carModel: tds[EntrylistColumns.CAR_MODEL],
    livery: tds[EntrylistColumns.LIVERY],
    sns: tds[EntrylistColumns.SNS],
  };
}
