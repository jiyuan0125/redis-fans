import React from 'react';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import { withStyles, createStyles } from '@material-ui/core';

export type AppTreeItemProps = TreeItemProps & {
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const AppTreeItem = withStyles(() =>
  createStyles({
    iconContainer: {
      '& .close': {
        opacity: 0.3,
      },
    },
    group: {
      marginLeft: 7,
      paddingLeft: 18,
      borderLeft: `1px dashed`,
    },
  })
)((props: AppTreeItemProps) => <TreeItem {...props} />);
