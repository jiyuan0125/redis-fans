import { createMuiTheme } from '@material-ui/core/styles';
import { zhCN } from '@material-ui/core/locale';
import * as colors from '@material-ui/core/colors';

const theme = createMuiTheme(
  {
    palette: {
      primary: {
        main: '#41484f',
      },
      secondary: colors.orange,
    },
    typography: {
      fontSize: 12,
    },
    props: {
      MuiButton: {
        size: 'small',
      },
      MuiFilledInput: {
        margin: 'dense',
      },
      MuiFormControl: {
        margin: 'dense',
      },
      MuiFormHelperText: {
        margin: 'dense',
      },
      MuiIconButton: {
        size: 'small',
      },
      MuiInputBase: {
        margin: 'dense',
      },
      MuiInputLabel: {
        margin: 'dense',
      },
      MuiListItem: {
        dense: true,
      },
      MuiOutlinedInput: {
        margin: 'dense',
      },
      MuiFab: {
        size: 'small',
      },
      MuiTable: {
        size: 'small',
      },
      MuiTextField: {
        margin: 'dense',
      },
      MuiToolbar: {
        variant: 'dense',
      },
      // Name of the component ⚛️
      MuiButtonBase: {
        // The properties to apply
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
      MuiIcon: {
        fontSize: 'inherit',
      },
      MuiSvgIcon: {
        fontSize: 'inherit',
      },
      MuiAvatar: {
        sizes: '',
      },
    },
    transitions: {
      // So we have `transition: none;` everywhere
      create: () => 'none',
    },
    shape: {
      borderRadius: 2,
    },
    overrides: {
      MuiIconButton: {
        sizeSmall: {
          // Adjust spacing to reach minimal touch target hitbox
          marginLeft: 4,
          marginRight: 4,
          padding: 12,
        },
      },
      MuiTabs: {
        root: {
          minHeight: 24,
        },
      },
      MuiTab: {
        root: {
          minHeight: 24,
        },
      },
    },
  },
  zhCN
);

// const theme = createMuiTheme({});

export default theme;
