import React from 'react';
import { createStyles, Theme, ListItemAvatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Settings, DataObject } from '@src/types';
import clsx from 'clsx';
import { FixedSizeList } from 'react-window';
import _ from 'lodash';
import AutoSizer from 'react-virtualized-auto-sizer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appListRoot: {
      height: '100%',
      backgroundColor: theme.palette.background.paper,
      paddingLeft: theme.spacing(1),
      '& .MuiList-root': {
        padding: 0,
      },
    },
    appListRow: {
      paddingLeft: 0,
      paddingRight: 0,
      '& .MuiListItemAvatar-root': {
        minWidth: 0,
      },
    },
    objectLabel: {
      fontFamily: (props: Settings) => props.uiFont,
      fontSize: (props: Settings) => `${props.uiFontSize}px`,
    },
    selected: {
      backgroundColor: theme.palette.grey[200],
    },
  })
);

export interface RowType {
  id: string;
  name: string;
}

export interface AppListProps {
  className?: string;
  rows: RowType[];
  appSettings: Settings;
  onContextMenu?: (
    row: RowType
  ) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  getAvatar?: (row: RowType) => React.ReactElement;
  onRowClick?: (row: RowType) => void;
  onRowDoubleClick?: (row: RowType) => void;
  activeObject?: DataObject;
}

export const AppList = React.memo((props: AppListProps) => {
  const {
    rows,
    appSettings,
    onContextMenu,
    getAvatar,
    onRowClick,
    onRowDoubleClick,
    activeObject,
  } = props;
  const classes = useStyles(appSettings);

  return (
    <div className={clsx(classes.appListRoot, props.className)}>
      <AutoSizer disableWidth>
        {({ height }) => (
          <FixedSizeList
            width="100%"
            height={height}
            itemData={rows}
            itemKey={(index: number, data: DataObject) => data[index].key}
            itemCount={rows.length}
            itemSize={28}
          >
            {({ style, data, index }) => {
              const row = data[index];
              return (
                <ListItem
                  button
                  className={clsx(classes.appListRow, {
                    [classes.selected]:
                      activeObject && activeObject.id === row.id,
                  })}
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row);
                    }
                  }}
                  onDoubleClick={() => {
                    if (onRowDoubleClick) {
                      onRowDoubleClick(row);
                    }
                  }}
                  style={style}
                  onContextMenu={onContextMenu && onContextMenu(row)}
                >
                  {getAvatar && (
                    <ListItemAvatar>{getAvatar(row)}</ListItemAvatar>
                  )}
                  <ListItemText
                    primary={
                      <pre className={classes.objectLabel}>{row.key}</pre>
                    }
                  />
                </ListItem>
              );
            }}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
});
