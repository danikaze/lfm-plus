import {
  TransformObjectOptions,
  transformObject,
} from '@utils/transform-object';
import { msgError } from '@utils/logging';
import { addXhrLoadHandler } from '@utils/xhr';
import { Race } from '@store/types';
import { AppDispatch } from '@store';
import { setDataFromApi } from '@store/features/race';

export function interceptRacesApiData(dispatch: AppDispatch): void {
  addXhrLoadHandler(
    (xhr) => {
      try {
        const apiData = JSON.parse(xhr.body);
        const data = transformObject(apiData, convertOptions) as Race;
        dispatch(setDataFromApi(data));
      } catch (e) {
        msgError(e);
      }
    },
    {
      url: (url) =>
        /api2\.lowfuelmotorsport\.com\/api\/race\/\d+/.test(url.href),
    }
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
    cargroup: 'carGroup',
    assistrules: 'assistRules',
    eventrules: 'eventRules',
  },
  // transform the rest from snake_case to camelCase
  keyCase: { from: 'snake', to: 'camelAsIs' },
};
