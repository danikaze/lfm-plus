import { FC, ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { WaitForOptions, waitFor } from '@utils/wait-for';

export type Props = DirectPortal | WaitingPortal;

export interface DirectPortal {
  container?: HTMLElement;
  children: ReactNode;
}

export interface WaitingPortal {
  waitForContainer: () => HTMLElement | null;
  waitForOptions?: Omit<WaitForOptions<null>, 'failValue'>;
  children: ReactNode;
}

export const Portal: FC<Props> = (props) => {
  const [container, setContainer] = useState<HTMLElement | null>(
    isWaitingPortal(props)
      ? props.waitForContainer()
      : props.container || document.body
  );

  useEffect(() => {
    if (container || !isWaitingPortal(props)) return;
    const options = { ...props.waitForOptions, failValue: null };
    waitFor<HTMLElement, null>(props.waitForContainer, options)
      .then((elem) => setContainer(elem))
      .catch(() => {});
  }, [
    (props as DirectPortal).container,
    (props as WaitingPortal).waitForContainer,
  ]);

  if (!container) return null;
  return createPortal(props.children, container || document.body);
};

function isWaitingPortal(props: Props): props is WaitingPortal {
  return (props as WaitingPortal).waitForContainer !== undefined;
}
