import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

let CoinLogo = (props: SvgIconProps) => {

    const st0: React.CSSProperties = {
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeMiterlimit: 10,
    };

    const st1: React.CSSProperties = {
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeMiterlimit: 10,
    };

    const st2: React.CSSProperties = {
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'square',
        strokeMiterlimit: 10,
    };

    const st3: React.CSSProperties = {
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 5,
        strokeLinecap: 'square',
        strokeMiterlimit: 10,
    };

    return (
        <SvgIcon viewBox="0 0 64 64" {...props}>
            <circle cx="38.22" cy="36.29" r="6.6"/>
            <circle style={st0} cx="56.27" cy="13.38" r="1.98"/>
            <circle style={st0} cx="35.48" cy="3.03" r="1.98"/>
            <circle style={st0} cx="15.43" cy="20.64" r="1.98"/>
            <circle cx="6.78" cy="36.29" r="2.64"/>
            <circle style={st0} cx="13.97" cy="58.67" r="1.98"/>
            <circle style={st0} cx="38.06" cy="61.25" r="1.98"/>
            <circle style={st0} cx="60.35" cy="54.39" r="1.98"/>
            <line style={st1} x1="8.83" y1="36.29" x2="34.79" y2="36.29"/>
            <path style={st2} d="M11.84,33.33c-1.03-1.75-2.86-2.99-5.04-2.99c-3.28,0-5.94,2.66-5.94,5.94c0,3.28,2.66,5.94,5.94,5.94
                c2.18,0,4.01-1.23,5.04-2.99"/>
            <path style={st3} d="M54.32,27.14c-3.18-5.58-9.18-9.35-16.06-9.35c-10.21,0-18.49,8.28-18.49,18.49c0,10.21,8.28,18.49,18.49,18.49
                c6.88,0,12.88-3.77,16.06-9.35"/>
            <line style={st0} x1="23.42" y1="26.17" x2="17.02" y2="21.79"/>
            <path style={st0} d="M38.22,36.29"/>
            <line style={st0} x1="49.32" y1="22.22" x2="55.04" y2="14.97"/>
            <path style={st0} d="M38.22,36.29"/>
            <line style={st0} x1="35.63" y1="5.07" x2="36.74" y2="18.42"/>
            <line style={st0} x1="38.06" y1="54.22" x2="38.02" y2="59.2"/>
            <path style={st0} d="M38.22,36.46"/>
            <line style={st0} x1="58.8" y1="53.22" x2="52.03" y2="47.71"/>
            <line style={st0} x1="25.03" y1="48.43" x2="15.43" y2="57.27"/>
            <path style={st0} d="M38.22,36.29"/>
        </SvgIcon>);
};

export default CoinLogo;