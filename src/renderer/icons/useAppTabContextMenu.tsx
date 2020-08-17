import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Tab } from '@src/types';

const initialState = {
  mouseX: null,
  mouseY: null,
  tab: null,
};

export interface UseAppTabContextMenuProps {
  deleteTab: (tab: Tab) => void;
  deleteOtherTabs: (tab: Tab) => void;
  deleteTabsToTheRight: (tab: Tab) => void;
}

export const useAppTabContextMenu = (props: UseAppTabContextMenuProps) => {
  const [state, setState] = React.useState<{
    mouseX: null | number;
    mouseY: null | number;
    tab: null | Tab;
  }>(initialState);

  const showMenu = React.useCallback(
    (tab: Tab) => (event: React.MouseEvent<Element>) => {
      event.preventDefault();
      setState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
        tab,
      });
    },
    []
  );

  const handleClose = () => {
    setState(initialState);
  };

  const handleDeleteTab = () => {
    if (state.tab) {
      deleteTab(state.tab);
    }
    handleClose();
  };

  const handleDeleteOtherTabs = () => {
    if (state.tab) {
      deleteOtherTabs(state.tab);
    }
    handleClose();
  };

  const handleDeleteTabsToTheRight = () => {
    if (state.tab) {
      deleteTabsToTheRight(state.tab);
    }
    handleClose();
  };

  const { deleteTab, deleteOtherTabs, deleteTabsToTheRight } = props;

  const rendererMenu = () => {
    return (
      <Menu
        keepMounted
        open={state.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleDeleteTab}>Close</MenuItem>
        <MenuItem onClick={handleDeleteOtherTabs}>Close Other Tabs</MenuItem>
        <MenuItem onClick={handleDeleteTabsToTheRight}>
          Close Tabs to the Right
        </MenuItem>
      </Menu>
    );
  };

  return {
    showMenu,
    rendererMenu,
  };
};
