import { FC, useMemo } from 'react';

import { Portal } from '@components/portal';
import { TimePctgIcon } from '@components/time-pctg-icon';

import { useRacePage } from './hooks';

export interface Props {
  eventId: number;
  raceId: number;
}

export const RacePage: FC<Props> = (props) => {
  const { currentSplitData } = useRacePage(props);

  const elems = useMemo(() => {
    return currentSplitData?.rows.map(({ lapTime }) => {
      const lapElem = lapTime && (
        <Portal container={lapTime.elem}>
          <TimePctgIcon pctg={lapTime.pctg} />
        </Portal>
      );

      return <>{lapElem}</>;
    });
  }, [currentSplitData]);

  return <>{elems}</>;
};
