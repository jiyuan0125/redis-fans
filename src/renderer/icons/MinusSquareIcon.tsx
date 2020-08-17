import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <>
    <path
      d="M815.2 911.7H210.8c-55.4 0-100.7-45.3-100.7-100.7V206.5c0-55.4 45.3-100.7
  100.7-100.7h604.5c55.4 0 100.7 45.3 100.7 100.7V811c0 55.3-45.3 100.7-100.8
  100.7zM210.8 156.1c-30.2 0-50.4 20.1-50.4 50.4V811c0 30.2 20.1 50.4 50.4
  50.4h604.5c30.2 0 50.4-20.1 50.4-50.4V206.5c0-30.2-20.1-50.4-50.4-50.4H210.8z
  m0 0"
      p-id="4781"
    ></path>
    <path
      d="M714.5 533.9h-403c-15.1
  0-25.2-10.1-25.2-25.2s10.1-25.2 25.2-25.2h403c15.1 0 25.2 10.1 25.2 25.2s-10.1
  25.2-25.2 25.2z m0 0"
      p-id="4782"
    ></path>
  </>,
  'MinusSquareIcon'
);

export const MinusSquareIcon = (props: SvgIconProps) => (
  <Icon viewBox="0 0 1024 1024" {...props} />
);
