import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <path d="M448.512 1006.592c-237.568 0-432.128-194.56-432.128-432.128s194.56-436.224 440.32-432.128c232.448 6.144 419.84 194.56 419.84 432.128S686.08 1006.592 448.512 1006.592z m178.176-737.28c-69.632 0-129.024 59.392-129.024 129.024S552.96 527.36 626.688 527.36c69.632 0 129.024-55.296 129.024-129.024-2.048-69.632-55.296-129.024-129.024-129.024z m251.904 0c-69.632 0-129.024-55.296-122.88-129.024 0-69.632 55.296-122.88 129.024-122.88 69.632 0 122.88 59.392 122.88 129.024s-59.392 122.88-129.024 122.88z"></path>,
  'LuaIcon'
);

export const LuaIcon = (props: SvgIconProps) => <Icon viewBox="0 0 1024 1024" {...props} />;
