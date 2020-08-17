import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <path
    d="M187.78 721.514c-17.526 17.184-45.666
  16.906-62.85-0.622-17.184-17.528-16.906-45.666 0.622-62.85L488.22
  302.486c17.53-17.186 45.674-16.906 62.856 0.628L899.52 658.67c17.18 17.53
  16.896 45.67-0.634 62.85-17.532 17.18-45.67 16.896-62.852-0.634L518.704 397.08
  187.78 721.514z"
  ></path>,
  'UpIcon'
);

export const UpIcon = (props: SvgIconProps) => (
  <Icon viewBox="0 0 1024 1024" {...props} />
);
