import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <path
    d="M593.962667
 716.885333H307.114667v-81.92h286.848m122.922666-82.005333H307.114667v-81.92h409.770666m0-82.005333H307.114667v-81.92h409.770666m81.962667-163.925334H225.152c-45.482667
 0-81.92 36.48-81.92 81.92v573.738667a81.92 81.92 0 0 0 81.92 81.92h573.696a81.92 81.92 0 0 0
 81.962667-81.92V225.152a81.92 81.92 0 0 0-81.92-81.962667z"
  ></path>,
  'LogIcon'
);

export const LogIcon = (props: SvgIconProps) => <Icon viewBox="0 0 1024 1024" {...props} />;
