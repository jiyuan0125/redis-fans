import React from 'react';
import electron from 'electron';
import { Tab } from '@src/types';
const { Menu, MenuItem } = electron.remote;

export interface UseAppTabContextMenuProps {
  deleteTab: (tab: Tab) => void;
  deleteOtherTabs: (tab: Tab) => void;
  deleteTabsToTheRight: (tab: Tab) => void;
}

export const useAppTabContextMenu = (props: UseAppTabContextMenuProps) => {
  const { deleteTab, deleteOtherTabs, deleteTabsToTheRight } = props;

  const handleDeleteTab = React.useCallback(
    (tab: Tab) => {
      if (tab) {
        deleteTab(tab);
      }
    },
    [deleteTab]
  );

  const handleDeleteOtherTabs = React.useCallback(
    (tab: Tab) => {
      if (tab) {
        deleteOtherTabs(tab);
      }
    },
    [deleteOtherTabs]
  );

  const handleDeleteTabsToTheRight = React.useCallback(
    (tab: Tab) => {
      if (tab) {
        deleteTabsToTheRight(tab);
      }
    },
    [deleteTabsToTheRight]
  );

  const showMenu = React.useCallback(
    (tab: Tab) => (_ev: React.MouseEvent<Element>) => {
      const menu = new Menu();
      menu.append(
        new MenuItem({
          label: 'Close',
          click() {
            handleDeleteTab(tab);
          },
        })
      );
      menu.append(
        new MenuItem({
          label: 'Close Other Tabs',
          click() {
            handleDeleteOtherTabs(tab);
          },
        })
      );
      menu.append(
        new MenuItem({
          label: 'Close Tabs to the Right',
          click() {
            handleDeleteTabsToTheRight(tab);
          },
        })
      );
      menu.popup({ window: electron.remote.getCurrentWindow() });
    },
    [handleDeleteTab, handleDeleteOtherTabs, handleDeleteTabsToTheRight]
  );

  return {
    showMenu,
  };
};
