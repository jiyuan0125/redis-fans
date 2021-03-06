import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <>
    <path
      d="M910.222
  142.222v-28.444H625.778v56.889h227.555v227.555h56.89z m0
  739.556v28.444H625.778v-56.889h227.555V625.778h56.89zM113.778
  142.222v-28.444h284.444v56.889H170.667v227.555h-56.89z m0
  739.556v28.444h284.444v-56.889H170.667V625.778h-56.89z"
      p-id="10401"
    ></path>
    <path
      d="M568.889 417.166l281.6-281.6 40.22 40.278-281.6
    281.6z m-153.998 35.67l-281.6-281.6 40.22-40.22 281.6 281.6z m194.218
    113.777l281.6 281.6-40.22 40.164-281.6-281.6z m-153.998 44.829l-281.6
    281.6-40.22-40.278 281.6-281.6z"
      p-id="10402"
    ></path>
  </>,
  'FullScreenIcon'
);

export const FullScreenIcon = (props: SvgIconProps) => (
  <Icon viewBox="0 0 1024 1024" {...props} />
);
