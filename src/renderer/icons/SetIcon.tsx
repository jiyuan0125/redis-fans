import * as React from 'react';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import { SvgIconProps } from '@material-ui/core';

const Icon = createSvgIcon(
  <path
    d="M79.55456 632.14592c33.18784 20.20352 65.69984 30.30016 97.49504 30.30016 39.99744 0 59.99616-10.69056 59.99616-32.1024 0-15.19616-16.49664-27.904-49.50016-38.10304-41.20576-12.8-69.49888-27.04384-84.89984-42.752-15.4112-15.69792-23.10144-36.94592-23.10144-63.75424 0-32.59392 13.19936-58.15296 39.59808-76.6464 26.39872-18.49344 60.99968-27.7504 103.80288-27.7504 30.40256 0 59.6992 4.49536 87.90016 13.49632v76.19584c-25.8048-15.19616-54.20032-22.80448-85.1968-22.80448-15.4112 0-27.8016 2.75456-37.20192 8.25344-9.41056 5.50912-14.10048 12.7488-14.10048 21.74976 0 15.19616 13.98784 27.50464 42.00448 36.90496 30.0032 10.00448 52.54144 19.0976 67.64544 27.29984 15.104 8.20224 26.59328 19.00544 34.49856 32.39936 7.89504 13.40416 11.84768 28.90752 11.84768 46.49984 0 34.2016-13.70112 60.75392-41.10336 79.64672-27.41248 18.90304-64.01024 28.35456-109.80352 28.35456-36.00384 0-69.30432-5.70368-99.90144-17.1008v-80.08704zM686.15168 582.64576H467.75296c3.39968 51.4048 34.38592 77.09696 92.99968 77.09696 36.59776 0 68.89472-9.00096 96.90112-27.00288v71.09632c-30.19776 16.9984-69.79584 25.4976-118.80448 25.4976-52.79744 0-93.85984-14.8992-123.14624-44.6976-29.29664-29.7984-43.95008-71.29088-43.95008-124.49792 0-52.992 15.59552-96.04096 46.7968-129.14688 31.20128-33.09568 70.38976-49.65376 117.59616-49.65376 46.99136 0 83.74272 14.25408 110.25408 42.752 26.50112 28.49792 39.75168 67.64544 39.75168 117.4528v41.10336z m-90.30656-60.60032c0-49.60256-20.10112-74.40384-60.30336-74.40384-16.60928 0-31.31392 6.79936-44.10368 20.39808-12.8 13.60896-20.80768 31.60064-24.00256 53.99552h128.4096zM944.44544 717.34272c-14.60224 7.99744-36.7104 12.00128-66.304 12.00128-70.4 0-105.59488-36.99712-105.59488-111.0016V461.74208h-54.59968v-72.30464h54.59968v-72.89856l96.29696-27.5968v100.49536h75.60192v72.30464h-75.60192v139.79648c0 35.39968 13.98784 53.10464 42.00448 53.10464 10.8032 0 21.99552-3.19488 33.59744-9.60512v72.30464z"
    p-id="1207"
  ></path>,
  'SetIcon'
);

export const SetIcon = (props: SvgIconProps) => (
  <Icon viewBox="0 0 1024 1024" {...props} />
);
