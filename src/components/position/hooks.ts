import { useRef, useEffect, useState } from 'react';
import { PositionAbsoluteProps, PositionRelativeProps, Props } from '.';

interface State {
  self: HTMLDivElement | null;
  rel: HTMLElement | null;
  relBounds: DOMRect | null;
  pos: { x: number; y: number } | null;
}

export function usePosition(props: Props) {
  const relativeProps = arePropsRelative(props);
  const ref = useRef<HTMLDivElement>(null);
  const [{ relBounds: bounds, self, rel }, setState] = useState<State>({
    self: ref.current,
    rel: relativeProps ? props.relativeTo.current : null,
    relBounds: null,
    pos: !relativeProps ? { x: props.x, y: props.y } : null,
  });

  // update references
  useEffect(() => {
    const rel = relativeProps ? props.relativeTo.current : null;
    setState((state) => ({
      rel,
      self: ref.current,
      relBounds: rel && rel.getBoundingClientRect(),
      pos: state.pos,
    }));
  }, [relativeProps && props.relativeTo.current, ref.current]);

  // update bounds on window resize
  relativeProps &&
    useEffect(() => {
      if (!props.trackChanges) return;

      const handler = () => {
        if (!rel) return;
        setState((state) => ({
          ...state,
          relBounds: rel.getBoundingClientRect(),
        }));
      };
      window.addEventListener('resize', handler);

      return () => window.removeEventListener('resize', handler);
    }, []);

  // update bounds when relativeTo changes
  relativeProps &&
    useEffect(() => {
      if (!props.trackChanges || !rel) return;
      const callback: MutationCallback = (mutationList) => {
        for (const mutation of mutationList) {
          if (mutation.type !== 'attributes' || mutation.target !== rel) {
            continue;
          }
          setState((state) => ({
            ...state,
            relBounds: rel.getBoundingClientRect(),
          }));
        }
      };

      const observer = new MutationObserver(callback);
      observer.observe(rel, { attributes: true });

      return () => observer.disconnect();
    }, [rel]);

  if (relativeProps && !rel) return { ref };

  function getStyle(): Record<'top' | 'left', number> | undefined {
    if ((relativeProps && !bounds) || !self) return;

    const selfBounds = self.getBoundingClientRect();
    const { anchor } = props;
    const marginV = Array.isArray(props.margin)
      ? props.margin[0]
      : props.margin || 0;
    const marginH = Array.isArray(props.margin)
      ? props.margin[1]
      : props.margin || 0;

    // absolute alignment by default
    let top = (props as PositionAbsoluteProps).y;
    let left = (props as PositionAbsoluteProps).x;

    // side-based alignment if `relativeTo` is provided
    if (relativeProps && bounds) {
      const { side } = props;
      if (side === 'center') {
        top = bounds.top + bounds.height / 2;
        left = bounds.left + bounds.width / 2;
      } else {
        if (side.includes('n')) {
          top = bounds.top - marginV;
        } else if (side.includes('s')) {
          top = bounds.bottom + marginV;
        } else {
          top = bounds.top + bounds.height / 2;
        }

        if (side.includes('w')) {
          left = bounds.left - marginH;
        } else if (side.includes('e')) {
          left = bounds.right + marginH;
        } else {
          left = bounds.left + bounds.width / 2;
        }
      }
    }

    // anchor-based alignment
    if (anchor === 'center') {
      top -= selfBounds.height / 2;
      left -= selfBounds.width / 2;
    } else {
      if (anchor.includes('n')) {
        top += 0;
      } else if (anchor.includes('s')) {
        top -= selfBounds.height;
      } else {
        top -= selfBounds.height / 2;
      }

      if (anchor.includes('w')) {
        left += 0;
      } else if (anchor.includes('e')) {
        left -= selfBounds.width;
      } else {
        left -= selfBounds.width / 2;
      }
    }

    return {
      top,
      left,
    };
  }

  return {
    ref,
    ...getStyle(),
  };
}

function arePropsRelative(
  props: Props
): props is Props & PositionRelativeProps {
  return (props as PositionRelativeProps).relativeTo !== undefined;
}
