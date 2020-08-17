import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <>
    <path
      d="M160.4 908.8c-22.7 0-41.1-18-41.7-40.4l81.8-457.2V410c0-22.9 18.7-41.5
  41.8-41.5h674.5c22.6 0 41.1 18 41.8 40.4l-81.8 457.2v1.2c0 22.9-18.7 41.5-41.8
  41.5H160.4z"
    ></path>
    <path
      d="M200.6
  313.4h654.5v-64.8c0-29.4-22.1-53.2-49.4-53.2H435.3l-74.1-79.8h-247c-27.3
  0-49.4 23.8-49.4 53.2v638.3l80.8-440.4c0.1-29.4 24.8-53.3 55-53.3"
    ></path>
  </>,
  'OpenIcon'
);

export const OpenIcon = (props: SvgIconProps) => (
  <Icon viewBox="0 0 1024 1024" {...props} />
);
