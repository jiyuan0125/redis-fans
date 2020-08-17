import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <path
    d="M692.071703 329.86173c-48.372707-48.387034-112.705921-75.023694-181.146687-75.023694-68.440765 0-132.747373 26.63666-181.148733 75.023694-48.400337 48.374754-75.022671 112.707968-75.022671 181.123151s26.623357 132.74635 75.022671 181.146687c48.374754 48.402383 112.707968 75.023694 181.148733 75.023694 68.441788 0 132.745327-26.647917 181.146687-75.023694 48.427966-48.373731 75.024717-112.706945 75.024717-181.146687C767.096421 442.544115 740.447481 378.237507 692.071703 329.86173z"
    p-id="1063"
  ></path>,
  'StatusIcon'
);

export interface StatusIconProps {
  color: string;
}

export const StatusIcon = (props: SvgIconProps) => (
  <Icon color={props.color} viewBox="0 0 1024 1024" {...props} />
);
