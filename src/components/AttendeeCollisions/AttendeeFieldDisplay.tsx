import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { IAttendee } from '../../store/attendee';
import { TableCell } from '@material-ui/core';
import { IProfile, isProfile } from '../../store/profile';
import TableRowWithHidden from '../UserInterface/TableRowWithHidden';
import { validNonEmptyString } from '../../util';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    toDisplay: IAttendee | IProfile;
    fieldName: string;
    fieldSelector: (profile: IAttendee | IProfile) => string | null;
}

const AttendeeFieldDisplay: React.FC<IProps> = ({
    classes,
    toDisplay,
    fieldName,
    fieldSelector,
}) => {
    const field: string | null = fieldSelector(toDisplay);

    return (
        <TableRowWithHidden hidden={!isProfile(toDisplay) && !validNonEmptyString(field)}>
            <TableCell component="th" scope="row">{fieldName}</TableCell>
            <TableCell align="right">{field}</TableCell>
        </TableRowWithHidden>);
}

export default withStyles(styles)(AttendeeFieldDisplay);