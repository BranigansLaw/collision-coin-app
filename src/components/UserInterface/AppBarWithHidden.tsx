import React from 'react';
import { AppBar, AppBarProps } from '@material-ui/core';

interface IAppBarWithHiddenProps {
    hidden?: boolean;
}

export default class AppBarWithHidden extends React.Component<AppBarProps & IAppBarWithHiddenProps> {
    render(){
        const {
            hidden,
            ...buttonProps
        } = this.props;
    
        if (hidden === undefined || hidden) {
            return <></>;
        }
        else {
            return <AppBar {...buttonProps} />;
        }
    }
}