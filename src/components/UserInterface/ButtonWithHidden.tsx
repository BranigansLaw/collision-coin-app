import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';

interface IGridWithHiddenProps {
    hidden?: boolean;
}

export default class ButtonWithHidden extends React.Component<ButtonProps & IGridWithHiddenProps> {
    render(){
        const {
            hidden,
            ...buttonProps
        } = this.props;
    
        if (hidden === undefined || hidden) {
            return <></>;
        }
        else {
            return <Button {...buttonProps} />;
        }
    }
}