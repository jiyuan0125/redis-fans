import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <>
    <path d="M0 0h1024v1024H0z"></path>
    <path d="M384 608a32 32 0 1 0 0 64v-64z m256 64a32 32 0 1 0 0-64v64z m-96-160a32 32 0 1 0-64 0h64z m-64 256a32 32 0 1 0 64 0h-64zM192 320l-22.624-22.624A32 32 0 0 0 160 320h32z m224-224V64a32 32 0 0 0-22.624 9.376L416 96z m416 128h-32 32z m0 576h32-32zM192 800h32-32z m256-448v32a32 32 0 0 0 32-32h-32z m-256 0H160h32z m192 320h256v-64h-256v64z m96-160v256h64v-256h-64z m-265.376-169.376l224-224-45.248-45.248-224 224 45.248 45.248zM320 960h384v-64H320v64zM800 224v576h64V224h-64zM320 896a96 96 0 0 1-96-96H160a160 160 0 0 0 160 160v-64z m384 64a160 160 0 0 0 160-160h-64a96 96 0 0 1-96 96v64z m0-832a96 96 0 0 1 96 96h64a160 160 0 0 0-160-160v64z m-288 0h32V64h-32v64z m32 0h256V64h-256v64z m-288 192v32h64v-32H160z m0 32v448h64V352H160z m256-256v256h64V96h-64z m32 224H192v64h256v-64z"></path>
  </>,
  'AddConnectionIcon'
);

export const AddConnectionIcon = (props: SvgIconProps) => (
  <Icon viewBox="0 0 1024 1024" {...props} />
);
