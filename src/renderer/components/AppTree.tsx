import React from 'react';
import { createStyles, Theme, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Settings, DataObject } from '@src/types';
import clsx from 'clsx';
import _ from 'lodash';
import AutoSizer from 'react-virtualized-auto-sizer';
import Tree, { FixedSizeNodeData } from 'react-vtree/dist/lib/FixedSizeTree';
import { FolderCloseIcon } from '@src/icons/FolderCloseIcon';
import { FolderOpenIcon } from '@src/icons/FolderOpenIcon';
import { useImmer } from 'use-immer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appTreeRoot: {
      height: '100%',
      backgroundColor: theme.palette.background.paper,
      paddingLeft: theme.spacing(1),
    },
    appTreeRow: {},
    appTreeButton: {
      padding: 0,
      width: 16,
    },
    appTreeText: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.grey[100],
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

export type TreeNode = {
  children: TreeNode[];
  id: string;
  name: string;
  dataType: string;
};

const findTargetNode = (nodes: TreeNode[], id: string) => {
  for (const node of nodes) {
    if (!isLeaf(node)) {
      return findTargetNode(node.children, id);
    }
    if (node.id === id) {
      return node;
    }
  }
};

export type StackElement = {
  nestingLevel: number;
  node: TreeNode;
};

export type ExtendedData = {
  readonly isLeaf: boolean;
  readonly name: string;
  readonly nestingLevel: number;
  readonly childCount: number;
};

export interface RowType {
  id: string;
  name: string;
}

const getLeafCount = (node: TreeNode) => {
  if (isLeaf(node)) return 1;
  else {
    return node.children.map((n) => getLeafCount(n)).reduce((a, b) => a + b);
  }
};

const isLeaf = (node: TreeNode) => {
  return !(node.children && node.children.length > 0);
};

export interface AppTreeProps {
  className?: string;
  rows: TreeNode[];
  appSettings: Settings;
  onContextMenu?: (
    row: RowType
  ) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  getAvatar?: (row: RowType) => React.ReactElement;
  onRowClick?: (row: RowType) => void;
  onRowDoubleClick?: (row: RowType) => void;
  activeObject?: DataObject;
}

export const AppTree = React.memo((props: AppTreeProps) => {
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

  const [rowStates, updateRowStates] = useImmer({} as Record<string, boolean>);

  const getTreeWalker = React.useCallback(
    (nodes: TreeNode[]) => {
      return function* treeWalker(
        refresh: boolean
      ): Generator<
        FixedSizeNodeData<ExtendedData> | string | symbol,
        void,
        boolean
      > {
        const stack: StackElement[] = [];

        nodes.forEach((node) => {
          stack.unshift({
            nestingLevel: 0,
            node,
          });
        });

        while (stack.length !== 0) {
          const { node, nestingLevel } = stack.pop()!;
          const id = node.id.toString();

          const isOpened = yield refresh
            ? {
                id,
                isLeaf: isLeaf(node),
                isOpenByDefault: rowStates[id] || false,
                name: node.name,
                nestingLevel,
                childCount: getLeafCount(node),
              }
            : id;

          if (!isLeaf(node) && isOpened) {
            for (let i = node.children.length - 1; i >= 0; i--) {
              stack.push({
                nestingLevel: nestingLevel + 1,
                node: node.children[i],
              });
            }
          }
        }
      };
    },
    [rowStates]
  );

  const handleToggle = (row: RowType, toggle: () => void, isOpen: boolean) => {
    toggle();
    updateRowStates((draft) => {
      draft[row.id] = isOpen;
    });
  };

  const renderNode = ({ data, isOpen, style, toggle }) => {
    const { id, isLeaf, name, nestingLevel, childCount } = data;
    return (
      <div
        style={{
          ...style,
          alignItems: 'center',
          display: 'flex',
          paddingLeft: nestingLevel * 16,
          boxSizing: 'border-box',
        }}
        className={clsx(classes.appTreeText, {
          [classes.selected]: activeObject && activeObject.id === id,
        })}
        onClick={
          isLeaf
            ? () => {
                if (onRowClick) {
                  onRowClick(data);
                }
              }
            : () => handleToggle(data, toggle, !isOpen)
        }
        onDoubleClick={
          isLeaf
            ? () => {
                if (onRowDoubleClick) {
                  onRowDoubleClick(data);
                }
              }
            : () => handleToggle(data, toggle, !isOpen)
        }
        onContextMenu={onContextMenu && onContextMenu(data)}
      >
        {isLeaf ? (
          getAvatar && getAvatar(data)
        ) : (
          <IconButton
            onClick={() => handleToggle(data, toggle, !isOpen)}
            className={classes.appTreeButton}
          >
            {isOpen ? <FolderOpenIcon /> : <FolderCloseIcon />}
          </IconButton>
        )}
        {isLeaf ? (
          <div>
            <pre className={classes.objectLabel}>{name}</pre>
          </div>
        ) : (
          <div>
            <pre className={classes.objectLabel}>
              {name}({childCount})
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={clsx(classes.appTreeRoot, props.className)}>
      <AutoSizer disableWidth>
        {({ height }) => {
          return (
            <Tree<ExtendedData>
              treeWalker={getTreeWalker(rows as TreeNode[])}
              itemSize={28}
              height={height}
              width="100%"
            >
              {renderNode}
            </Tree>
          );
        }}
      </AutoSizer>
    </div>
  );
});
