import React from 'react';
import { TableRow, TableRowProps } from '@material-ui/core';

interface ITableRowWithHiddenProps {
    hidden?: boolean;
}

export default class TableRowWithHidden extends React.Component<TableRowProps & ITableRowWithHiddenProps> {
    render(){
        const {
            hidden,
            ...buttonProps
        } = this.props;
    
        if (hidden === undefined || hidden) {
            return <></>;
        }
        else {
            return <TableRow {...buttonProps} />;
        }
    }
}