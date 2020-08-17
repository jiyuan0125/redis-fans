import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <path d="M931.882 259.882l-167.764-167.764A96 96 0 0 0 696.236 64H160C106.98 64 64 106.98 64 160v704c0 53.02 42.98 96 96 96h704c53.02 0 96-42.98 96-96V327.764a96 96 0 0 0-28.118-67.882zM512 832c-70.692 0-128-57.308-128-128 0-70.692 57.308-128 128-128s128 57.308 128 128c0 70.692-57.308 128-128 128z m192-609.04V424c0 13.254-10.746 24-24 24H216c-13.254 0-24-10.746-24-24V216c0-13.254 10.746-24 24-24h457.04c6.366 0 12.47 2.528 16.97 7.03l6.96 6.96A23.992 23.992 0 0 1 704 222.96z"></path>,
  'SaveIcon'
);

export const SaveIcon = (props: SvgIconProps) => (
  <Icon viewBox="0 0 1024 1024" {...props} />
);
