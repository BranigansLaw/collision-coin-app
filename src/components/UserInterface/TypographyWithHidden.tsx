import React from 'react';
import { Typography, TypographyProps } from '@material-ui/core';

interface ITypographyWithHiddenProps {
    hidden?: boolean;
}

export default class TypographyWithHidden extends React.Component<TypographyProps & ITypographyWithHiddenProps> {
    render(){
        const {
            hidden,
            ...buttonProps
        } = this.props;
    
        if (hidden === undefined || hidden) {
            return <></>;
        }
        else {
            return <Typography {...buttonProps} />;
        }
    }
}