import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <>
    <path
      d="M588.402 393.102l281.6-281.6 40.22 40.22-281.6 281.6z m281.6 514.845l-281.6-281.6 40.22-40.22 281.6 281.6z m-713.728 2.275l-40.22-40.22 281.6-281.6 40.163 40.22z"
      p-id="10544"
    ></path>
    <path
      d="M568.889 426.667v28.444h284.444v-56.889H625.778V170.667h-56.89z m0 170.666V568.89h284.444v56.889H625.778v227.555h-56.89zM111.502 153.998l40.22-40.22 281.6 281.6-40.277 40.22z"
      p-id="10545"
    ></path>
    <path
      d="M455.111 426.667v28.444H170.667v-56.889h227.555V170.667h56.89z m0 170.666V568.89H170.667v56.889h227.555v227.555h56.89z"
      p-id="10546"
    ></path>
  </>,
  'CancelFullScreenIcon'
);

export const CancelFullScreenIcon = (props: SvgIconProps) => (
  <Icon viewBox="0 0 1024 1024" {...props} />
);
