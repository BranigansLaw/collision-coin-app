import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

let QrCodeIcon = (props: SvgIconProps) => {
    return (
        <SvgIcon viewBox="0 0 24 24" {...props}>
            <g>
                <path d="M9,2v7H2V2H9 M11,0H0v11h11V0L11,0z"/>
            </g>
            <rect x="4" y="4" width="3" height="3"/>
            <g>
                <path d="M22,2v7h-7V2H22 M24,0H13v11h11V0L24,0z"/>
            </g>
            <rect x="17" y="4" width="3" height="3"/>
            <g>
                <path d="M9,15v7H2v-7H9 M11,13H0v11h11V13L11,13z"/>
            </g>
            <rect x="4" y="17" width="3" height="3"/>
            <rect x="13" y="13" width="4" height="4"/>
            <rect x="20" y="13" width="4" height="4"/>
            <rect x="13" y="20" width="4" height="4"/>
            <rect x="20" y="20" width="4" height="4"/>
        </SvgIcon>);
};

export default QrCodeIcon;