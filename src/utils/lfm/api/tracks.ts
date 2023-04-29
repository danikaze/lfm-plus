import { SimId } from '@utils/lfm';

/**
 * Just call the track/records API by using XHR
 * Because this API is being intercepted, the store will be updated
 * automatically with the data from the result
 */
export function updateTrackInfo(): void {
  Object.values(SimId)
    .filter((id) => !isNaN(id as number))
    .forEach((simId) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        'GET',
        `https://api2.lowfuelmotorsport.com/api/tracks/records?sim=${simId}`
      );
      xhr.send();
    });
}
