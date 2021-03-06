import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <>
    <path
      d="M929 483c-16.6 0-30 13.4-30 30v387.9s-0.1 0.1 0 0.1H123.1s-0.1-0.1-0.1 0V513c0-16.6-13.4-30-30-30s-30 13.4-30 30v388c0 33.1 26.9 60 60 60h776c33.1 0 60-26.9 60-60V513c0-16.6-13.4-30-30-30z"
      p-id="6159"
    ></path>
    <path
      d="M489.2 753.6l0.6 0.6c5.8 5.8 13.5 8.8 21.2 8.8 7.7 0 15.4-2.9 21.2-8.8l0.6-0.6 221.4-221.4c11.7-11.7 11.7-30.8 0-42.4-11.7-11.7-30.8-11.7-42.4 0L541 660.6V95c0-16.5-13.5-30-30-30s-30 13.5-30 30v565.6L310.2 489.8c-11.7-11.7-30.8-11.7-42.4 0-11.7 11.7-11.7 30.8 0 42.4l221.4 221.4z"
      p-id="6160"
    ></path>
  </>,
  'DownloadIcon'
);

export const DownloadIcon = (props: SvgIconProps) => (
  <Icon viewBox="0 0 1024 1024" {...props} />
);
