import React, { useRef } from 'react';
import { AppTab, AppTabProps } from './AppTab';
import { useDrop, DropTargetMonitor, useDrag } from 'react-dnd';
import { XYCoord } from 'dnd-core';

export type DirectionType = 'horizontal' | 'vertical';

export interface DragItem {
  value: any;
  index: number;
  type: string;
}

export type SortableAppTabProps = AppTabProps & {
  onSwap: (dragIndex: number, hoverIndex: number) => void;
  direction?: DirectionType;
  onDoubleClick?: () => void;
};

export const AppSortableTab = React.memo(
  (props: SortableAppTabProps & DragItem) => {
    const ref = useRef<HTMLDivElement>(null);
    const { index, type, value, onSwap, direction = 'horizontal' } = props;
    const [, drop] = useDrop({
      accept: type,
      hover(item: DragItem, monitor: DropTargetMonitor) {
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = ref.current?.getBoundingClientRect();

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        if (direction === 'horizontal') {
          // Get vertical middle
          const hoverMiddleY =
            (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

          // Get pixels to the top
          const hoverClientY =
            (clientOffset as XYCoord).y - hoverBoundingRect.top;

          // Only perfor the move when the mouse has crossed half of the items height
          // When dragging downwards, only move when the cursor is below 50%
          // When dragging upwards, only move when the cursor is above 50%

          // Dragging downwards
          if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
          }

          // Dragging upwards
          if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
          }
        } else {
          // Get vertical middle
          const hoverMiddleX =
            (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

          // Get pixels to the top
          const hoverClientX =
            (clientOffset as XYCoord).x - hoverBoundingRect.left;

          // Only perfor the move when the mouse has crossed half of the items height
          // When dragging downwards, only move when the cursor is below 50%
          // When dragging upwards, only move when the cursor is above 50%

          // Dragging downwards
          if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
            return;
          }

          // Dragging upwards
          if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
            return;
          }
        }

        // Time to actually perform the action
        onSwap(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex;
      },
    });

    const [{ isDragging }, drag] = useDrag({
      item: { type, value, index },
      collect: (monitor: any) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));

    const { onSwap: _onSwap, ...rest } = props;
    return <AppTab ref={ref} style={{ opacity }} {...rest} />;
  }
);
