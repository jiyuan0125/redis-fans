import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <path
    d="M987.428571 347.428571l0 402.285714q0 52.589714-37.741714
  90.258286t-90.258286 37.741714l-694.857143 0q-52.589714
  0-90.258286-37.741714t-37.741714-90.258286l0-548.571429q0-52.589714
  37.741714-90.258286t90.258286-37.741714l182.857143 0q52.589714 0 90.258286
  37.741714t37.741714 90.258286l0 18.285714 384 0q52.589714 0 90.258286
  37.741714t37.741714 90.258286z"
    p-id="12258"
  ></path>,
  'FolderCloseIcon'
);

export const FolderCloseIcon = (props: SvgIconProps) => (
  <Icon viewBox="0 0 1024 1024" {...props} />
);
