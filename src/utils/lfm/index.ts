export enum SimId {
  ACC = 1,
  RF2 = 2,
}

export const SimNames: Record<SimId, string> = {
  [SimId.ACC]: 'Assetto Corsa Competizione',
  [SimId.RF2]: 'rFactor 2',
};

export const enum NonBaseContent {
  BASE = 0,
  DLC = 1,
}

export enum CarClass {
  CHL = 'CHL',
  CUP = 'CUP',
  GT3 = 'GT3',
  GT4 = 'GT4',
  ST = 'ST',
  TCX = 'TCX',
}

export const enum LfmLicense {
  ROOKIE = 'ROOKIE',
  IRON = 'IRON',
  IRON_PLUS = 'IRON+',
  BRONZE = 'BRONZE',
  BRONZE_PLUS = 'BRONZE+',
  SILVER = 'SILVER',
  SILVER_PLUS = 'SILVER+',
  GOLD = 'GOLD',
  GOLD_PLUS = 'GOLD+',
  PLATINUM = 'PLATINUM',
  LEGEND = 'LEGEND',
  ALIEN = 'ALIEN',
}

export const enum LfmEventType {
  SEASON = 'Season',
}

export const enum RaceSessionType {
  RACE = 'R',
  QUALI = 'Q',
  PRACTICE = 'P',
}

export const enum QualifyingFormat {
  SINGLE = 'SINGLE_QUALIFYING',
}

export const enum IncidentType {
  C = 'C', // 1x: Track limits / Lap without giving position back???
  D = 'D', // 4x: Collisions
}
