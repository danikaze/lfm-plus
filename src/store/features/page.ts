import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { msgLog } from '@utils/logging';

export type PageState =
  | UnknownPage
  | IndexPage
  | TrackRecordsPage
  | MyAccountPage
  | UserProfilePage
  | RaceResultPage
  | SeasonsPage;

export interface UnknownPage {
  page: 'unknown';
}

export interface IndexPage {
  page: 'index';
}

export interface TrackRecordsPage {
  page: 'trackRecords';
}

export interface MyAccountPage {
  page: 'account';
}

export interface UserProfilePage {
  page: 'user';
  userId: number;
}

export interface RaceResultPage {
  page: 'raceResults';
  eventId: number;
  raceId: number;
}

export interface SeasonsPage {
  page: 'seasons';
  series: string;
  pageType:
    | 'upcoming'
    | 'recent'
    | 'standings'
    | 'mysessions'
    | 'schedule'
    | 'prizes';
}

export const pageSlice = createSlice({
  name: 'page',
  initialState: parseUrl(new URL(location.href)),
  reducers: {
    updateUrl: (state, action: PayloadAction<URL>) => {
      let newPage: PageState | undefined;
      try {
        newPage = parseUrl(action.payload);
      } catch {}
      msgLog(`Navigation detected`, newPage);
      return newPage || { page: 'unknown' };
    },
  },
});

export const { updateUrl } = pageSlice.actions;

export const pageReducer = pageSlice.reducer;

function parseUrl(url: URL): PageState | undefined {
  if (url.host !== 'lowfuelmotorsport.com') {
    throw new Error(`Current URL not supported (${url.href})`);
  }

  if (url.pathname === '/') {
    return { page: 'index' };
  }

  if (url.pathname === '/tracks/records') {
    return { page: 'trackRecords' };
  }

  if (url.pathname === '/users') {
    return { page: 'account' };
  }

  const profileMatch = /\/profile\/(\d+)/.exec(url.pathname);
  if (profileMatch) {
    const userId = Number(profileMatch[1]);
    return { page: 'user', userId };
  }

  const raceResultMatch = /\/events\/(\d+)\/race\/(\d+)/.exec(url.pathname);
  if (raceResultMatch) {
    const eventId = Number(raceResultMatch[1]);
    const raceId = Number(raceResultMatch[2]);
    return { page: 'raceResults', eventId, raceId };
  }

  const seriesMatch =
    /\/seasonsv2\/([^/])\/(upcoming|recent|standings|mysessions|schedule|prizes)/.exec(
      url.pathname
    );
  if (seriesMatch) {
    const series = seriesMatch[1];
    const pageType = seriesMatch[2] as SeasonsPage['pageType'];
    return { page: 'seasons', series, pageType };
  }

  return { page: 'unknown' };
}
