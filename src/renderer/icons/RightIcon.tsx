import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <path
    d="M761.056 532.128c0.512-0.992 1.344-1.824 1.792-2.848 8.8-18.304 5.92-40.704-9.664-55.424L399.936 139.744a48 48 0 0 0-65.984 69.76l316.96 299.84-315.712 304.288a48 48 0 0 0 66.624 69.12l350.048-337.376c0.672-0.672 0.928-1.6 1.6-2.304 0.512-0.48 1.056-0.832 1.568-1.344 2.72-2.848 4.16-6.336 6.016-9.6z"
    p-id="10100"
  ></path>,
  'RightIcon'
);

export const RightIcon = (props: SvgIconProps) => <Icon viewBox="0 0 1024 1024" {...props} />;
