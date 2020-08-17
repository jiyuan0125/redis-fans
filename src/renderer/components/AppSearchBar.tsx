import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import clsx from 'clsx';
import { FormControl, OutlinedInput } from '@material-ui/core';
import { SearchIcon } from '@src/icons/SearchIcon';
import { CloseIcon } from '@src/icons/CloseIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appSearchBarRoot: {
      display: 'flex',
      marginRight: theme.spacing(1),
    },
    input: {
      flexGrow: 1,
    },
    clean: {
      cursor: 'pointer',
      '& .MuiSvgIcon-root': {
        fontSize: theme.typography.fontSize,
      },
    },
  })
);

export interface AppSearchBarProps {
  className?: string;
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
}

export const AppSearchBar = React.memo((props: AppSearchBarProps) => {
  const { searchKeyword, setSearchKeyword } = props;
  const classes = useStyles();

  const handleSearchInput = (ev: React.ChangeEvent<{ value: string }>) => {
    setSearchKeyword(ev.target.value);
  };

  const handleSearchClean = () => {
    setSearchKeyword('');
  };

  return (
    <div className={clsx(classes.appSearchBarRoot, props.className)}>
      <FormControl fullWidth>
        <OutlinedInput
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          endAdornment={
            searchKeyword && (
              <InputAdornment
                className={classes.clean}
                position="start"
                onClick={handleSearchClean}
              >
                <CloseIcon />
              </InputAdornment>
            )
          }
          className={classes.input}
          placeholder="Filter"
          value={searchKeyword}
          onChange={handleSearchInput}
        />
      </FormControl>
    </div>
  );
});
