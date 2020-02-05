import React from 'react';
import { Fab, FabProps } from '@material-ui/core';

interface IFabWithHiddenProps {
    hidden?: boolean;
}

export default class FabWithHidden extends React.Component<FabProps & IFabWithHiddenProps> {
    render(){
        const {
            hidden,
            ...buttonProps
        } = this.props;
    
        if (hidden === undefined || hidden) {
            return <></>;
        }
        else {
            return <Fab {...buttonProps} />;
        }
    }
}