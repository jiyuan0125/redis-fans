import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { DIMENSION_APPRESIZER_HANDLER_SIZE } from '@src/constants';

export const useStyles = makeStyles(() =>
  createStyles({
    appResizerRoot: {
      position: 'absolute',
      left: (props: AppResizerProps) =>
        props.position === 'left'
          ? -(DIMENSION_APPRESIZER_HANDLER_SIZE / 2)
          : 'auto',
      right: (props: AppResizerProps) =>
        props.position === 'right'
          ? -(DIMENSION_APPRESIZER_HANDLER_SIZE / 2)
          : 'auto',
      top: (props: AppResizerProps) =>
        props.position === 'top'
          ? -(DIMENSION_APPRESIZER_HANDLER_SIZE / 2)
          : 'auto',
      bottom: (props: AppResizerProps) =>
        props.position === 'bottom'
          ? -(DIMENSION_APPRESIZER_HANDLER_SIZE / 2)
          : 'auto',
      width: (props: AppResizerProps) =>
        props.position === 'top' || props.position === 'bottom'
          ? '100%'
          : DIMENSION_APPRESIZER_HANDLER_SIZE,
      height: (props: AppResizerProps) =>
        props.position === 'left' || props.position === 'right'
          ? '100%'
          : DIMENSION_APPRESIZER_HANDLER_SIZE,
      '&:hover': {
        cursor: (props: AppResizerProps) =>
          props.position === 'left' || props.position === 'right'
            ? 'col-resize'
            : 'row-resize',
      },
      zIndex: 1200,
    },
  })
);

export type Position = 'top' | 'bottom' | 'left' | 'right';

export interface AppResizerProps {
  className?: string;
  size: number;
  minSize?: number;
  maxSize?: number;
  position: Position;
  onSizeChange: (size: number) => void;
}

export interface MousePoint {
  x: number;
  y: number;
}

export const AppResizer = React.memo((props: AppResizerProps) => {
  const resizerDOMRef = React.useRef<HTMLDivElement>(null);
  const mousePointRef = React.useRef<MousePoint>({
    x: 0,
    y: 0,
  });
  const classes = useStyles(props);
  const { size, minSize, maxSize, position = 'left', onSizeChange } = props;
  const innerSizeRef = React.useRef<number>(size);

  React.useEffect(() => {
    const resizerDOM = resizerDOMRef.current;
    if (!resizerDOM) return;
    let sizeToChange = innerSizeRef.current;
    const handleMouseMove = (ev: MouseEvent) => {
      switch (position) {
        case 'left':
          sizeToChange =
            innerSizeRef.current + mousePointRef.current.x - ev.clientX;
          document.body.style.cursor = 'col-resize';
          break;
        case 'right':
          sizeToChange =
            innerSizeRef.current + ev.clientX - mousePointRef.current.x;
          document.body.style.cursor = 'col-resize';
          break;
        case 'top':
          sizeToChange =
            innerSizeRef.current + mousePointRef.current.y - ev.clientY;
          document.body.style.cursor = 'row-resize';
          break;
        case 'bottom':
          sizeToChange =
            innerSizeRef.current + ev.clientY - mousePointRef.current.y;
          document.body.style.cursor = 'row-resize';
          break;
        default:
        // do nothing
      }
      if (minSize && sizeToChange < minSize) {
        sizeToChange = minSize;
        switch (position) {
          case 'left':
            document.body.style.cursor = 'w-resize';
            break;
          case 'right':
            document.body.style.cursor = 'e-resize';
            break;
          case 'top':
            document.body.style.cursor = 'n-resize';
            break;
          case 'bottom':
            document.body.style.cursor = 's-resize';
            break;
          default:
          // do nothing
        }
      }
      if (maxSize && sizeToChange > maxSize) {
        sizeToChange = maxSize;
        switch (position) {
          case 'left':
            document.body.style.cursor = 'e-resize';
            break;
          case 'right':
            document.body.style.cursor = 'w-resize';
            break;
          case 'top':
            document.body.style.cursor = 's-resize';
            break;
          case 'bottom':
            document.body.style.cursor = 'n-resize';
            break;
          default:
          // do nothing
        }
      }

      onSizeChange(sizeToChange);
    };

    const handleMouseDown = (ev: MouseEvent) => {
      mousePointRef.current = {
        x: ev.clientX,
        y: ev.clientY,
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
    };

    const handleMouseUp = () => {
      mousePointRef.current = {
        x: 0,
        y: 0,
      };
      innerSizeRef.current = sizeToChange;
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'default';
    };

    if (resizerDOM) {
      resizerDOM.addEventListener('mousedown', handleMouseDown);
    }
  }, []);

  return (
    <div
      className={clsx(classes.appResizerRoot, props.className)}
      ref={resizerDOMRef}
    ></div>
  );
});
