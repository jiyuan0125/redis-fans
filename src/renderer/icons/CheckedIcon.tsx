import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <path d="M431.56 832.334c-20.505 0-40.192-8.093-54.833-22.734L232.181 665.055l-73.49-70.821c-19.088-18.396-19.651-48.782-1.255-67.871s48.782-19.649 67.871-1.256l74.444 71.752 129.435 129.436 363.619-514.333c15.303-21.647 45.258-26.79 66.903-11.485 21.646 15.304 26.789 45.257 11.485 66.903L494.981 799.523c-13.239 18.726-33.936 30.582-56.786 32.529a78.116 78.116 0 0 1-6.635 0.282z"></path>,
  'CheckedIcon'
);

export const CheckedIcon = (props: SvgIconProps) => (
  <Icon viewBox="0 0 1024 1024" {...props} />
);
