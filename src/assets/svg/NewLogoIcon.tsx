import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

const NewLogoIcon = (props: SvgIconProps) => {
    return (
        /* From Conference-QuestCSSTestLogo-01Presentation Attributes */
        <SvgIcon viewBox="0 0 90 90" {...props}>
            <circle id="captured" cx="51.6" cy="43.39" r="9.26" fill="currentColor"/>
            <circle id="captured" cx="9.08" cy="43.39" r="3.99" fill="currentColor"/>
            <circle id="mag" cx="80.36" cy="68.11" r="2.99" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="2"/>
            <line id="captured" x1="7.18" y1="43.39" x2="46.41" y2="43.39" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2"/>
            <path id="bigC" d="M75.92,29.57a27.95,27.95,0,1,0,0,27.65" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/>
            <circle id="mag" cx="51.6" cy="43.39" r="16.41" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="4"/>
            <line id="mag" x1="64.36" y1="54.64" x2="75.36" y2="63.81" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="5"/>
        </SvgIcon>);
};

export default NewLogoIcon;