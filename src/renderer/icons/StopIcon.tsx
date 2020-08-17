import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <path
    d="M512 0c-282.784 0-512 229.216-512 512s229.216 512 512 512 512-229.216
  512-512-229.216-512-512-512zM512 928c-229.76 0-416-186.24-416-416s186.24-416
  416-416 416 186.24 416 416-186.24 416-416 416zM320 320l384 0 0 384-384 0z"
  ></path>,
  'StopIcon'
);

export const StopIcon = (props: SvgIconProps) => (
  <Icon viewBox="0 0 1024 1024" {...props} />
);
