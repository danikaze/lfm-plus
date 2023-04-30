import {
  TransformObjectOptions,
  transformObject,
} from '@utils/transform-object';
import { msgError } from '@utils/logging';
import { addXhrLoadHandler } from '@utils/xhr';
import { setDataFromApi } from '@store/features/tracks';
import { TrackDataWithRecords } from '@store/types';
import { AppDispatch } from '@store';

export function interceptTrackApiData(dispatch: AppDispatch): void {
  addXhrLoadHandler(
    (xhr) => {
      try {
        const apiData = JSON.parse(xhr.body);
        const data = transformApiData(apiData);
        dispatch(setDataFromApi(data));
      } catch (e) {
        msgError(e);
      }
    },
    {
      url: (url) =>
        url.href.includes('api2.lowfuelmotorsport.com/api/tracks/records'),
    }
  );
}

function transformApiData(apiData: any[]): TrackDataWithRecords[] {
  return apiData.map(
    (item) => transformObject(item, convertOptions) as TrackDataWithRecords
  );
}

const convertOptions: TransformObjectOptions = {
  // do not transform keys that are enums
  keyBypass: ['CHL', 'CUP', 'GT3', 'GT4', 'ST', 'TCX'],
  // explicitly transform the next keys
  keyTransform: {
    username: 'userName',
    shortname: 'shortName',
    steamid: 'steamId',
    vorname: 'firstName',
    nachname: 'lastName',
  },
  // transform the rest from snake_case to camelCase
  keyCase: { from: 'snake', to: 'camel' },
};
