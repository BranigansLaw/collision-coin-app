import React from 'react';
import { Grid, GridProps } from '@material-ui/core';

interface IGridWithHiddenProps {
    hidden?: boolean;
}

export default class GridWithHidden extends React.Component<GridProps & IGridWithHiddenProps> {
    render(){
        const {
            hidden,
            ...buttonProps
        } = this.props;
    
        if (hidden === undefined || hidden) {
            return <></>;
        }
        else {
            return <Grid {...buttonProps} />;
        }
    }
}