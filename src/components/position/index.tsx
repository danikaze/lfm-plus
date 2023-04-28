import { clsx } from 'clsx';
import { CSSProperties, FC, HTMLAttributes, ReactNode, RefObject } from 'react';
import { usePosition } from './hooks';

import styles from './position.module.scss';

export type PositionPoint =
  | 'center'
  | 'nw'
  | 'n'
  | 'ne'
  | 'w'
  | 'e'
  | 'sw'
  | 's'
  | 'se';

export type Props = PositionRelativeProps | PositionAbsoluteProps;

interface BaseProps {
  anchor: PositionPoint;
  margin?: number | [number, number];
  className?: string;
  style?: HTMLAttributes<HTMLDivElement>['style'];
  children: ReactNode;
}

export interface PositionRelativeProps extends BaseProps {
  trackChanges?: boolean;
  side: PositionPoint;
  relativeTo: RefObject<HTMLElement>;
}

export interface PositionAbsoluteProps extends BaseProps {
  x: number;
  y: number;
}

export const Position: FC<Props> = (props) => {
  const { ref, top, left } = usePosition(props);

  // even if the position {top,left} is not ready we have to render it
  // so the reference can be attached, that's why in that case is rendered
  // "hidden" (to avoid the position glitch of the 1st render)
  const elemStyle: CSSProperties = { ...props.style, top, left };
  if (top === undefined) {
    elemStyle.display = 'none';
  }
  const elemClasses = clsx(styles.root, props.className);

  return (
    <div ref={ref} className={elemClasses} style={elemStyle}>
      {props.children}
    </div>
  );
};
