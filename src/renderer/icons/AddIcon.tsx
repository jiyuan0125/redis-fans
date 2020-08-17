import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <path
    d="M810.666667 554.666667h-256v256h-85.333334v-256H213.333333v-85.333334h256V213.333333h85.333334v256h256v85.333334z"
    p-id="13399"
  ></path>,

  'AddIcon'
);

export const AddIcon = (props: SvgIconProps) => <Icon viewBox="0 0 1024 1024" {...props} />;
