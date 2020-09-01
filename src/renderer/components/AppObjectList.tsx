import React from 'react';
import { createStyles, Theme, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  green,
  red,
  purple,
  blue,
  deepOrange,
  grey,
} from '@material-ui/core/colors';
import { StringIcon } from '@src/icons/StringIcon';
import { HashIcon } from '@src/icons/HashIcon';
import { ListIcon } from '@src/icons/ListIcon';
import { SetIcon } from '@src/icons/SetIcon';
import { ZsetIcon } from '@src/icons/ZsetIcon';
import { Settings, ObjectListShowType, DataObject } from '@src/types';
import { useAppObjectContextMenu } from './useAppObjectContextMenu';
import { UnknownIcon } from '@src/icons/UnknownIcon';
import _ from 'lodash';
import { AppList, RowType } from './AppList';
import {
  DIMENSION_OBJECT_LIST_AVATARWIDTH,
  DIMENSION_OBJECT_LIST_AVATARHEIGHT,
} from '@src/constants';
import { AppTree, TreeNode } from './AppTree';

const avatarWidth = DIMENSION_OBJECT_LIST_AVATARWIDTH;
const avatarHeight = DIMENSION_OBJECT_LIST_AVATARHEIGHT;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      marginLeft: theme.spacing(2),
    },
    typeString: {
      backgroundColor: theme.palette.common.white,
      color: green.A700,
      width: avatarWidth,
      height: avatarHeight,
    },
    typeHash: {
      backgroundColor: theme.palette.common.white,
      color: red.A700,
      width: avatarWidth,
      height: avatarHeight,
    },
    typeList: {
      backgroundColor: theme.palette.common.white,
      color: purple.A700,
      width: avatarWidth,
      height: avatarHeight,
    },
    typeSet: {
      backgroundColor: theme.palette.common.white,
      color: blue.A700,
      width: avatarWidth,
      height: avatarHeight,
    },
    typeZset: {
      backgroundColor: theme.palette.common.white,
      color: deepOrange.A700,
      width: avatarWidth,
      height: avatarHeight,
    },
    typeUnknown: {
      backgroundColor: theme.palette.common.white,
      color: grey.A700,
      width: avatarWidth,
      height: avatarHeight,
    },
    appObjectListContent: {
      '& > div > div': {
        overflow: 'scroll !important',
      },
      //'& > div > div::-webkit-scrollbar': {
      //width: 20,
      //height: 20,
      //},
      //'& > div > div::-webkit-scrollbar-thumb': {
      //backgroundColor: '#d6dee1',
      //backgroundClip: 'content-box',
      //border: '6px solid transparent',
      //},
      //'& > div > div::-webkit-scrollbar-thumb:hover': {
      //backgroundColor: '#a8bbbf',
      //},
    },
  })
);

export interface AppObjectListProps {
  className?: string;
  searchKeyword: string;
  objects: DataObject[];
  addObjectTab: (temporary: boolean, object: DataObject) => void;
  appSettings: Settings;
  advNameSpaceSeparator: string;
  showType: ObjectListShowType;
  activeObject?: DataObject;
  deleteObject: (object: DataObject) => void;
}

export const AppObjectList = React.memo((props: AppObjectListProps) => {
  const {
    objects,
    addObjectTab,
    searchKeyword,
    appSettings,
    advNameSpaceSeparator = ':',
    showType,
    activeObject,
    deleteObject,
  } = props;
  const { showMenu, rendererMenu } = useAppObjectContextMenu({
    deleteObject,
  });
  const classes = useStyles(appSettings);

  const getAvatar = React.useCallback(
    (row: RowType) => {
      const object = objects.find((o) => o.id === row.id);

      if (object) {
        switch (object.dataType) {
          case 'string':
            return (
              <Avatar className={classes.typeString}>
                <StringIcon />
              </Avatar>
            );
          case 'hash':
            return (
              <Avatar className={classes.typeHash}>
                <HashIcon />
              </Avatar>
            );
          case 'list':
            return (
              <Avatar className={classes.typeList}>
                <ListIcon />
              </Avatar>
            );
          case 'set':
            return (
              <Avatar className={classes.typeSet}>
                <SetIcon />
              </Avatar>
            );
          case 'zset':
            return (
              <Avatar className={classes.typeZset}>
                <ZsetIcon />
              </Avatar>
            );
          default:
            return (
              <Avatar className={classes.typeUnknown}>
                <UnknownIcon />
              </Avatar>
            );
        }
      } else {
        return (
          <Avatar className={classes.typeUnknown}>
            <UnknownIcon />
          </Avatar>
        );
      }
    },
    [objects]
  );

  const handleObjectClick = React.useCallback(
    (row: RowType) => {
      const object = objects.find((o) => o.id === row.id);
      if (object) {
        addObjectTab(true, object);
      }
    },
    [objects, addObjectTab]
  );

  const handleObjectDoubleClick = React.useCallback(
    (row: RowType) => {
      const object = objects.find((o) => o.id === row.id);
      if (object) {
        addObjectTab(false, object);
      }
    },
    [objects, addObjectTab]
  );

  const handleShowMenu = React.useCallback(
    (row: RowType) => (ev: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const object = objects.find((o) => o.id === row.id);
      if (object) {
        showMenu(object)(ev);
      }
    },
    [objects, showMenu]
  );

  const [filteredObjects, setFilteredObjects] = React.useState<DataObject[]>(
    objects
  );

  const doFilter = React.useCallback(
    _.debounce((searchKeyword: string) => {
      setFilteredObjects(
        objects
          .filter(
            (object) =>
              object.key
                .toLowerCase()
                .indexOf(searchKeyword.toLocaleLowerCase()) > -1
          )
          .sort((a, b) => a.key.localeCompare(b.key))
      );
    }, 500),
    [setFilteredObjects, objects, searchKeyword]
  );

  React.useEffect(() => doFilter(searchKeyword), [searchKeyword, doFilter]);

  const populateTreeNode = React.useCallback(
    (
      keySegments: string[],
      parent: TreeNode | null,
      node: TreeNode,
      result: TreeNode[]
    ) => {
      let newNode = {} as TreeNode;
      const keySegment = keySegments.shift();
      if (keySegments.length == 0) {
        newNode = node;
      } else {
        newNode.id = keySegment!;
        newNode.name = keySegment!;
        newNode.dataType = node.dataType;
        newNode.children = [];
      }
      const targetParent = parent && parent.children ? parent.children : result;
      const existsNode = targetParent.find((n) => n.name === keySegment);
      if (!existsNode) {
        targetParent.push(newNode);
      }
      if (keySegments.length > 0) {
        populateTreeNode(keySegments, existsNode || newNode, node, result);
      }
    },
    []
  );

  const parseTree = React.useCallback((): TreeNode[] => {
    const result: TreeNode[] = [];
    filteredObjects.forEach((n) => {
      const keySegments = n.key.split(advNameSpaceSeparator);
      populateTreeNode(
        keySegments,
        null,
        {
          id: n.id,
          name: n.key,
          dataType: n.dataType,
          //isOpenByDefault: false,
          children: [],
        },
        result
      );
    });

    return result;
  }, [filteredObjects]);

  const treeData = React.useMemo(() => parseTree(), [parseTree]);

  return (
    <div className={props.className}>
      {showType === 'flat' ? (
        <AppList
          className={classes.appObjectListContent}
          rows={(filteredObjects as unknown) as RowType[]}
          appSettings={appSettings}
          getAvatar={getAvatar}
          onRowClick={handleObjectClick}
          onRowDoubleClick={handleObjectDoubleClick}
          onContextMenu={handleShowMenu}
          activeObject={activeObject}
        />
      ) : (
        <AppTree
          className={classes.appObjectListContent}
          rows={treeData}
          appSettings={appSettings}
          getAvatar={getAvatar}
          onRowClick={handleObjectClick}
          onRowDoubleClick={handleObjectDoubleClick}
          onContextMenu={handleShowMenu}
          activeObject={activeObject}
          //onChangeOpenness={handleChangeOpenness}
        />
      )}
      {rendererMenu()}
    </div>
  );
});
