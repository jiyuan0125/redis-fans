import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <path
    d="M836.664 302.486c17.528-17.184 45.666-16.906 62.85 0.622 17.184 17.528
  16.906 45.666-0.622 62.85L536.226 721.514c-17.53 17.186-45.674
  16.906-62.858-0.628L124.924 365.33c-17.18-17.53-16.896-45.67 0.634-62.85
  17.532-17.18 45.672-16.896 62.852 0.634L505.74 626.92l330.924-324.434z"
  ></path>,
  'DownIcon'
);

export const DownIcon = (props: SvgIconProps) => (
  <Icon viewBox="0 0 1024 1024" {...props} />
);
