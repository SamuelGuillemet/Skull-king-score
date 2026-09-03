import { useEffect, useRef, type MouseEvent } from 'react';

/** Handlers to spread on an element that should react to a long press or a right click. */
export function useLongPress(onLongPress: () => void, delay = 550) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
  };

  useEffect(() => cancel, []);

  return {
    onPointerDown: () => {
      timer.current = setTimeout(onLongPress, delay);
    },
    onPointerUp: cancel,
    onPointerCancel: cancel,
    onPointerLeave: cancel,
    // A scroll gesture keeps the pointer down: cancel as soon as it moves.
    onPointerMove: cancel,
    onContextMenu: (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      onLongPress();
    },
  };
}
