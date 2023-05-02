import {
  CarClass,
  IncidentType,
  LfmEventType,
  LfmLicense,
  NonBaseContent,
  QualifyingFormat,
  RaceSessionType,
  SimId,
} from '@utils/lfm';

export type NumberAsString = string; // "1.23"
export type BooleanAsNumber = number; // "0" | "1"
export type LapTimeAsString = string; // "01:23.456"
export type RaceTimeAsString = string; // "0:01:23.456"
export type DateTimeAsString = string; // "2023-04-25 20:04:21"
export type DateAsString = string; // "2023-04-25"
export type JsonAsString = string;
export type NullAsString = 'null';
export type CountryCode = string; // "JP"

export interface TrackData {
  /** Unique track ID used by LFM */
  trackId: number;
  /** Displayed track name */
  trackName: string;
  /** Version of the track (i.e. 2023 = ACC 1.9) */
  trackYear: number;
  /**
   * File name for the thumbnail
   * https://lowfuelmotorsport.com/assets/img/tracks/${thumbnail}
   */
  thumbnail: string;
  /**
   * File name for the track map
   * https://lowfuelmotorsport.com/assets/img/tracks/maps/${trackmap}
   */
  trackmap: string;
  /** Country code */
  country: string;
  /** Number of turns */
  turns: number;
  /** Track length */
  km: number;
  /** Name of the city */
  city: string;

  /** Internal? name of the track in the game (also for rF2)  */
  accTrackName: string;
  /** Link to the track guide video */
  trackGuideVideo: string;
  /** Number as a string? */
  turnFactor: NumberAsString;
  /** ID to get the real time weather */
  openweatherCityId: number;
  /** Content for which game */
  simId: SimId;
  /** If included or not (DLC) in the base game */
  nonBaseContent: NonBaseContent;
  /** Name of the DLC */
  contentLink: string | null;
  /** Link to the DLC */
  contentLinkName: string | null;
  /** Unknown */
  simSettings: string;
}

export interface TrackDataWithRecords extends TrackData {
  records: Partial<Record<CarClass, TrackRecord>>;
}

export interface TrackDataWithClassRecords extends TrackData {
  records: TrackRecord;
}

export interface TrackRecord {
  qualifying: TrackRecordTime | [];
  race: TrackRecordTime | [];
}

export interface TrackRecordTime {
  lap: string;
  driver: string;
  userId: User['id'];
  origin: CountryCode;
  carId: Car['carId'];
  carName: string;
  carYear: number;
  date: string;
}

export interface CupCategory {
  cupCategoryId: number;
  cupCategory: string;
}

export interface Car {
  carId: number;
  serverValue: number;
  carName: string;
  year: number;
  class: CarClass;
  serverValue2: string;
  simId: SimId;
  nonBaseContent: NonBaseContent;
  contentLink: string;
  contentLinkName: string;
  additionalContent: [];
}

export interface User {
  id: number;
  /** Username (danikaze) */
  name: string;
  /** Display name (Danikaze) */
  userName: string;
  /** Name (Dani) (from API `vorname`) */
  firstName: string;
  /** Surname (Kaze) (from API `nachname`) */
  lastName: string;
  /** Shortname (DKZ) */
  shortName: string;
  steamId: string;
  avatar: string;
  email: string;
  emailVerifiedAt: string | null;
  admin: BooleanAsNumber;
  createdAt: DateTimeAsString;
  updatedAt: DateTimeAsString;
  discordId: string;
  profileExtras: string;
  origin: CountryCode;
  /** Base or RF2 rating */
  cRating: number;
  /** ACC rating */
  ccRating: number;
  twitchChannel: string;
  isTvBroadcaster: BooleanAsNumber;
  youtubeChannel: string;
  license: LfmLicense;
  /** SA is a number as a string */
  safetyRating: NumberAsString;
  division: number;
  validLicense: BooleanAsNumber;
  darkmode: BooleanAsNumber;
  patreon: BooleanAsNumber;
  deleted: boolean;
  isAdmin: boolean;
  isReko: boolean;
  /** Not sure how this works... */
  lastCars: [];
  gameservers: [];
  ratingBySim: SimRating[];
  onLfmDiscord: boolean;
  discordLinked: boolean;
  patreonLinked: boolean;
  blockedForReporting: boolean;
  discordPopup: boolean;
  nameChangeReq: 0;
}

export interface SimRating {
  rating: number;
  simId: SimId;
  /** Name of the Game */
  name: string;
  /** Logo for the Game */
  logoUrl: string;
  license: LfmLicense;
  division: number;
  rankedRaces: number;
}

export interface Race {
  raceId: number;
  eventId: RaceEventData['eventId'];
  track: Omit<TrackData, 'records'>;
  raceDate: DateTimeAsString;
  logfile: string;
  closed: 1;
  seasonWeek: 4;
  sessionRunning: BooleanAsNumber;
  /** Strength of Fields */
  sof: number;
  split1Sof: number;
  split2Sof: number;
  split3Sof: number;
  split4Sof: number;
  split5Sof: number;
  split6Sof: number;
  split7Sof: number;
  split8Sof: number;
  split9Sof: number;
  split10Sof: number;

  /** List of cars, and their drivers */
  entrylist: {
    entries: RaceEntry[];
    forceEntryList: BooleanAsNumber;
  };

  /** List of drivers for the events (including all splits) */
  participants: {
    entries: RaceParticipant[];
    forceEntryList: BooleanAsNumber;
  };

  splits: {
    /** Number of splits for this race */
    splits: number;
    diversPerSplit: number;
    driverCount: number;
    /** List of drivers in each split */
    participants: {
      entries: RaceParticipant[];
      forceEntryList: BooleanAsNumber;
    };
  };

  // multiTwitch
  // videolink
  isLive: BooleanAsNumber;

  raceResults: Record<CarClass, Record<'OVERALL', RaceResult[]>>;
  qualiResults: QualiResult[];

  /** Chat per split? */
  chat: ChatEntry[][];

  raceResultsSplits: Record<CarClass, Record<'OVERALL', RaceResult[]>>[];
  qualiResultsSplits: QualiResult[][];

  serverSettings: RaceServerSettings;
}

export interface RaceServerSettings {
  serverSettings: {
    assistRules: {
      file: string;
    };
    event: {
      file: string;
      data: {
        track: string;
        preRaceWaitingTimeSeconds: number;
        postRaceSeconds: number;
        sessionOverTimeSeconds: number;
        ambientTemp: number;
        cloudLevel: number;
        rain: number;
        weatherRandomness: number;
        simracerWeatherConditions: number;
        isFixedConditionQualification: BooleanAsNumber;
        sessions: RaceSessionConfig[];
        configVersion: number;
      };
    };
    eventRules: {
      file: string;
      data: {
        qualifyStandingType: number;
        pitWindowLengthSec: number;
        driverStintTimeSec: number;
        mandatoryPitstopCount: number;
        maxTotalDrivingTime: number;
        maxDriversCount: number;
        tyreSetCount: number;
        isRefuellingAllowedInRace: boolean;
        isRefuellingTimeFixed: boolean;
        isMandatoryPitstopRefuellingRequired: boolean;
        isMandatoryPitstopTyreChangeRequired: boolean;
        isMandatoryPitstopSwapDriverRequired: boolean;
      };
    };
    settings: {
      file: string;
      data: {
        serverName: string;
        password: string;
        spectatorPassword: string;
        centralEntryListPath: string;
        carGroup: CarClass;
        trackMedalsRequirement: number;
        safetyRatingRequirement: number;
        racecraftRatingRequirement: number;
        maxCarSlots: number;
        isRaceLocked: BooleanAsNumber;
        isLockedPrepPhase: BooleanAsNumber;
        shortFormationLap: BooleanAsNumber;
        dumpLeaderboards: BooleanAsNumber;
        dumpEntryList: BooleanAsNumber;
        randomizeTrackWhenEmpty: BooleanAsNumber;
        allowAutoDQ: BooleanAsNumber;
        formationLapType: number;
        configVersion: number;
      };
    };
  };
}

export interface RaceSessionConfig {
  hourOfDay: number;
  dayOfWeekend: number;
  timeMultiplier: number;
  sessionType: RaceSessionType;
  sessionDurationMinutes: number;
}

export interface RaceEventData {
  eventId: number;
  eventName: string;
  eventType: LfmEventType;
  simId: SimId;
  startDate: string;
  endDate: string;
  slots: number;
  fixedCar: BooleanAsNumber;
  closed: BooleanAsNumber;
  entrylist: string;
  thumbnail: string;
  urlCode: string;
  standings: string;
  gameServer: number;
  // settings
  // ...
  //
}

export interface RaceEntry {
  drivers: RaceDriver[];
  /** Car number (based on ELO) */
  raceNumber: number;
  forcedCarModel: Car['carId'];
  overrideDriverInfo: BooleanAsNumber;
  /** Can be -1 */
  defaultGridPosition: number;
  ballastKg: number;
  restrictor: number;
  customCar: string;
  overrideCarModelForCustomCar: BooleanAsNumber;
  isServerAdmin: BooleanAsNumber;
}

export interface RaceDriver {
  firstName: User['firstName'];
  lastName: User['lastName'];
  shortName: User['shortName'];
  /** Not LfmLicense (?) */
  driverCategory: number;
  /** not User['id'] (?) */
  playerID: string;
}

export interface RaceParticipant {
  /** car number (ordered from ELO) */
  raceNumber: number;
  /** First name (from API `vorname`) */
  firstName: User['firstName'];
  /** Last name (from API `nachname`) */
  nachname: User['lastName'];
  shortname: User['shortName'];
  steamId: User['steamId'];
  avatar: User['avatar'];
  origin: User['origin'];
  elo: number; // 1833;
  carModel: Car['carId'];
  twitchChannel: User['twitchChannel'];
  youtubeChannel: User['youtubeChannel'];
  isLive: boolean;
  license: LfmLicense;
  userId: User['id'];
  safetyRating: User['safetyRating'];
  teamId: Team['teamId'];
  teamName: Team['teamName'];
  teamLogo: Team['teamLogo'];
  split: number;
  patreon: BooleanAsNumber;
  carClass: CarClass;
  livery: null | string;
  nameOnServer: boolean;
}

export interface RaceResult {
  resultId: number;
  raceId: Race['raceId'];
  cup: BooleanAsNumber;
  /** General position */
  position: number;
  /** Position inside its class */
  classPosition: number;
  cupPosition: number;
  driverId: number;
  teamCarId: Team['teamId'];
  laps: number;
  bestlap: LapTimeAsString;
  time: RaceTimeAsString;
  timePenalty: number;
  dnf: BooleanAsNumber;
  points: NumberAsString;
  cupPoints: NumberAsString;
  lapsDetail: string;
  gap: LapTimeAsString;
  dns: number;
  split: number;
  carId: Car['carId'];
  simId: SimId;
  eventId: RaceEventData['eventId'];
  track: TrackData['trackId'];
  raceDate: DateTimeAsString;
  logfile: string;
  liveVideo: string;
  vodLink: string;
  livetiming: string;
  closed: BooleanAsNumber;
  seasonWeek: number;
  sessionRunning: BooleanAsNumber;
  sof: number;
  // sessionBroadcaster: number;
  // splittedRace: number;
  // split2SessionRunning: number;
  // split3SessionRunning: number;
  // split4SessionRunning: number;
  // split5SessionRunning: number;
  // split6SessionRunning: number;
  // split7SessionRunning: number;
  // split8SessionRunning: number;
  // split9SessionRunning: number;
  // split10SessionRunning: number;
  // split2Sof: number;
  // split3Sof: number;
  // split4Sof: number;
  // split5Sof: number;
  // split6Sof: number;
  // split7Sof: number;
  // split8Sof: number;
  // split9Sof: number;
  // split10Sof: number;
  // splitData: JsonAsString;
  // teamRaceSettings: '';
  // eventTestRace: 0;
  // extraQualifyingDay: 0;
  qualifyingFormat: QualifyingFormat;
  // qualifyingDate: null;
  // qualifyingSettings: null;
  // qualifyingExtraSettings: '';
  // reverseGridRaceId: null;
  // reverseGridSettings: '';
  // pointsOverride: '';
  // pointMultiplier: NumberAsString;
  // forcedSingleMakeCar: BooleanAsNumber;
  // eligibleForBopBudget: BooleanAsNumber;
  // teamDrivers: BooleanAsNumber;
  // split1Pid: number;
  // split2Pid: number;
  // split3Pid: number;
  // split4Pid: number;
  // split5Pid: number;
  // split6Pid: number;
  // split7Pid: number;
  // split8Pid: number;
  // split9Pid: number;
  // split10Pid: number;
  realWeather: 0;
  raceParticipantId: 1844286;
  userId: 85442;
  seasonId: 13;
  carModel: 32;
  serverAdmin: 0;
  createdAt: DateTimeAsString;
  updatedAt: DateTimeAsString;
  driverData: JsonAsString;
  raceStartElo: number;
  raceStartSr: NumberAsString;
  teamCarDriverNo: number;
  teamCarAdmin: BooleanAsNumber;
  livery: null | string;
  serverValue: Car['serverValue'];
  carName: Car['carName'];
  year: Car['year'];
  class: Car['class'];
  serverValue2: Car['serverValue2'];
  nonBaseContent: Car['nonBaseContent'];
  contentLink: Car['contentLink'];
  contentLinkName: Car['contentLinkName'];
  id: 85442;
  name: User['name'];
  userName: User['userName'];
  firstName: User['firstName'];
  shortName: User['shortName'];
  lastName: User['lastName'];
  steamId: User['steamId'];
  avatar: User['avatar'];
  email: User['email'];
  emailVerifiedAt: User['emailVerifiedAt'];
  password: string;
  rememberToken: string;
  admin: User['admin'];
  discordId: User['discordId'];
  profileExtras: User['profileExtras'];
  origin: User['origin'];
  cRating: User['cRating'];
  ccRating: User['ccRating'];
  twitchChannel: User['twitchChannel'];
  isTvBroadcaster: User['isTvBroadcaster'];
  youtubeChannel: User['youtubeChannel'];
  license: User['license'];
  safetyRating: User['safetyRating'];
  division: User['division'];
  validLicense: User['validLicense'];
  darkmode: User['darkmode'];
  patreon: User['patreon'];
  carNumber: number;
  bestOfTheWeek: BooleanAsNumber;
  lapDetail: RaceResultLapDetail[];
  positionGain: number;
  incidentDetail: RaceIncidentDetail[];
  rating: number;
  ratingGain: number;
  srChange: number;
  incidents: number;
  sr: NumberAsString;
}

export interface RaceResultLapDetail {
  lapId: number;
  eventId: RaceEventData['eventId'];
  raceId: Race['raceId'];
  trackId: TrackData['trackId'];
  /** Index to the list of participants */
  participantId: number;
  userId: User['id'];
  lap: number;
  lapValid: BooleanAsNumber;
  sessionType: RaceSessionType;
  createdAt: null | string;
  updatedAt: null | string;
  /** Time per section: [S1, S2, S3] */
  splits: LapTimeAsString[];
  carLap: number;
  split: number;
  carId: number;
  lapTime: LapTimeAsString;
}

export interface RaceIncidentDetail {
  id: number;
  raceId: Race['raceId'];
  userId: User['id'];
  serverTimestamp: number;
  serverTime: RaceTimeAsString;
  incidentType: IncidentType;
  createdAt: null;
  updatedAt: null;
  split: number;
  sessionTime: RaceTimeAsString;
  firstName: User['firstName'];
  lastName: User['lastName'];
}

export interface QualiResult {
  id: number;
  eventId: RaceEventData['eventId'];
  raceId: Race['raceId'];
  position: number;
  classPosition: number;
  participantId: number;
  userId: User['id'];
  teamCarId: number;
  bestLap: LapTimeAsString;
  gap: LapTimeAsString;
  createdAt: DateTimeAsString;
  updatedAt: DateTimeAsString;
  splits: LapTimeAsString[];
  laps: number;
  split: number;
  qSession: 'Q';
  raceParticipantId: number;
  seasonId: number;
  carModel: number;
  serverAdmin: BooleanAsNumber;
  driverData: JsonAsString;
  raceStartElo: number;
  raceStartSr: NumberAsString;
  teamCarDriverNo: number;
  teamCarAdmin: BooleanAsNumber;
  livery: null | string;
  name: User['name'];
  userName: User['userName'];
  firstName: User['firstName'];
  shortName: User['shortName'];
  lastName: User['lastName'];
  steamId: User['steamId'];
  avatar: User['avatar'];
  email: User['email'];
  emailVerifiedAt: null;
  password: string;
  rememberToken: string;
  admin: User['admin'];
  discordId: User['discordId'];
  profileExtras: User['profileExtras'];
  origin: User['origin'];
  cRating: User['cRating'];
  ccRating: User['ccRating'];
  twitchChannel: User['twitchChannel'];
  isTvBroadcaster: User['isTvBroadcaster'];
  youtubeChannel: User['youtubeChannel'];
  license: User['license'];
  safetyRating: User['safetyRating'];
  division: User['division'];
  validLicense: User['validLicense'];
  darkmode: User['darkmode'];
  patreon: User['patreon'];
  carId: Car['carId'];
  serverValue: Car['serverValue'];
  carName: Car['carName'];
  year: Car['year'];
  class: Car['class'];
  serverValue2: Car['serverValue2'];
  simId: Car['simId'];
  nonBaseContent: Car['nonBaseContent'];
  contentLink: Car['contentLink'];
  contentLinkName: Car['contentLinkName'];
  carNumber: number;
}

export interface ChatEntry {
  id: number;
  raceId: Race['raceId'];
  split: number;
  name: string;
  session: RaceSessionType;
  serverTimestamp: number;
  serverTime: LapTimeAsString;
  sessionTimestamp: number;
  sessionTime: LapTimeAsString;
  message: string;
}

export interface Team {
  teamId: number;
  teamName: string;
  foundingDate: DateAsString;
  teamWebsite: string | NullAsString;
  teamDiscord: string | NullAsString;
  teamLogo: string;
  recruiting: null;
  createdAt: DateTimeAsString;
  updatedAt: DateTimeAsString;
  teamFacebook: string | NullAsString;
  teamYoutube: string | NullAsString;
  teamTwitch: string | NullAsString;
  teamSpeak: string | NullAsString;
  teamTwitter: string | NullAsString;
  teamInstagram: string | NullAsString;
  description: string | NullAsString;
  origin: CountryCode;
  elo: number;
  safetyRating: number;
  members: number;
  leader: {
    memberId: number;
    teamId: Team['teamId'];
    teamAdmin: BooleanAsNumber;
    userId: User['id'];
    guestDriver: BooleanAsNumber;
    createdAt: DateTimeAsString;
    updatedAt: DateTimeAsString;
    id: number;
    name: User['name'];
    userName: User['userName'];
    shortName: User['shortName'];
    firstName: User['firstName'];
    lastName: User['lastName'];
    steamId: User['steamId'];
    avatar: User['avatar'];
    email: User['email'];
    emailVerifiedAt: User['emailVerifiedAt'];
    password: string;
    rememberToken: string;
    admin: User['admin'];
    discordId: User['discordId'];
    profileExtras: User['profileExtras'];
    origin: User['origin'];
    cRating: User['cRating'];
    ccRating: User['ccRating'];
    twitchChannel: User['twitchChannel'];
    isTvBroadcaster: User['isTvBroadcaster'];
    youtubeChannel: User['youtubeChannel'];
    license: User['license'];
    safetyRating: User['safetyRating'];
    division: User['division'];
    validLicense: User['validLicense'];
    darkmode: User['darkmode'];
    patreon: User['patreon'];
  };
}
