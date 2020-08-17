import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <path
    d="M849.6
  803.2L707.9 661.5c45.6-56.1 70.5-125.6 70.5-198.9
  0-84.3-32.8-163.6-92.5-223.3-59.6-59.6-138.9-92.5-223.3-92.5-84.3 0-163.6 32.8-223.3 92.5-59.6
  59.6-92.5 138.9-92.5 223.3s32.8 163.6 92.5 223.3c59.6 59.6 138.9 92.5 223.3 92.5 71.1 0 138.7-23.4
  193.9-66.5l142.2 142.2c7 7 16.2 10.5 25.5 10.5s18.4-3.5 25.5-10.5c13.9-14
  13.9-36.8-0.1-50.9zM218.9 462.7c0-134.4 109.3-243.7 243.7-243.7 134.4 0 243.7 109.3 243.7
  243.7S597 706.4 462.6 706.4c-134.4 0-243.7-109.3-243.7-243.7z"
    p-id="10235"
  ></path>,
  'SearchIcon'
);

export const SearchIcon = (props: SvgIconProps) => <Icon viewBox="0 0 1024 1024" {...props} />;
