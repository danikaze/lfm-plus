import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { throttle } from 'throttle-debounce';

import { tracksSelector } from '@store/selectors';
import { TrackData, TrackDataWithRecordsAllClasses } from '@store/types';
import { CarClass, SimId, SimNames } from '@utils/lfm';
import { waitFor } from '@utils/wait-for';
import { MUTATION_OBSERVER_THROTTLE, POLL_INTERVAL_MS } from '@utils/constants';
import { msgLog } from '@utils/logging';

interface TrackElems {
  elem: HTMLTitleElement;
  track: TrackData;
  carClass: CarClass;
}

export function useTrackRecordsPage() {
  const tracks = useSelector(tracksSelector);
  const [trackElems, setTrackElems] = useState<TrackElems[]>([]);
  const updateTracks = useMemo(
    () =>
      throttle(MUTATION_OBSERVER_THROTTLE, () => {
        setTrackElems((currentTracks) => {
          const newTracks = selectTrackElems(tracks.data);
          return newTracks ?? currentTracks;
        });
      }),
    [tracks]
  );

  useEffect(updateTracks, [tracks.updatedOn]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let details: HTMLDivElement | null;

    waitFor(
      () =>
        document.querySelector<HTMLDivElement>('#content .events') || undefined,
      { timeout: 30000 }
    )
      .then((container) => {
        if (!container) return;
        // for some reason couldn't make MutationObserver work, so here we are
        // back to the old good polling system :)
        setInterval(() => {
          const newDetails =
            container.querySelector<HTMLDivElement>('.details');
          if (details === newDetails) return;
          details = newDetails;
          if (details) {
            msgLog('Changes detected');
            updateTracks();
          }
        }, POLL_INTERVAL_MS);
      })
      .catch(() => {});

    return () => {
      clearInterval(interval);
    };
  }, [updateTracks]);

  return { trackElems };
}

function selectTrackElems(
  tracks: TrackDataWithRecordsAllClasses[] | undefined
): TrackElems[] | undefined {
  if (!tracks || !tracks.length) return;

  const simId = selectSimId();
  if (!simId) return;

  return Array.from(
    document.querySelectorAll<HTMLDivElement>('.events .details')
  ).reduce((res, detailsElem) => {
    const nameElem = detailsElem.querySelector('.name');
    if (!nameElem) return res;

    const match = /([^(]+)\((\d+)\)/.exec(nameElem.textContent!);
    if (!match) return res;

    const trackName = match[1].trim();
    const trackYear = Number(match[2]);
    const track = tracks.find(
      (track) =>
        track.simId === simId &&
        track.trackName === trackName &&
        track.trackYear === trackYear
    );

    if (!track || !track.records) return res;

    const carClassElems = Array.from(
      detailsElem.querySelectorAll<HTMLTitleElement>('.times h2')
    );
    carClassElems.forEach((carClassElem) => {
      const carClass = carClassElem.textContent?.trim() as CarClass;
      const records = track.records?.[carClass];
      if (
        !records ||
        (Array.isArray(records.qualifying) && Array.isArray(records.qualifying))
      ) {
        return;
      }

      res.push({
        track,
        carClass,
        elem: carClassElem,
      });
    });

    return res;
  }, [] as TrackElems[]);
}

function selectSimId(): SimId | undefined {
  const texts = Array.from(
    document.querySelectorAll(
      '.mat-form-field-infix mat-select .mat-select-value'
    )
  ).map((e) => e.textContent);

  return (
    Object.values(SimId).filter((id) => !isNaN(id as number)) as SimId[]
  ).find((simId) => texts.includes(SimNames[simId]));
}
