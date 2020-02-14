import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { usePrevious } from '../usePrevious';
import { Spring } from 'react-spring/renderprops';
import { Typography } from '@material-ui/core';
import { Guid } from 'guid-typescript';

const styles = (theme: Theme) => createStyles({
    root: {
    },
    differenceOuter: {
        position: 'relative',
    },
    difference: {
        position: 'absolute',
        fontWeight: 'bolder',
        fontSize: '0.75em',
        zIndex: 1000,
    },
});

interface IProps extends WithStyles<typeof styles> {
    val: number;
}

const RunningCounter: React.FC<IProps> = ({
    val,
    classes,
}) => {
    const prevBalance: number | undefined = usePrevious(val);
    const prev: number = prevBalance !== undefined ? prevBalance : val;
    const difference: number = val - prev;
    const newKey: string | null = difference !== 0 ? Guid.create().toString() : null;

    return (
        <>
            {newKey !== null ? (
                <Spring
                    key={newKey}
                    from={{number: 1}}
                    to={{number: 0}}
                    config={{
                        mass: 1,
                        tension: 140,
                        friction: 60,
                    }}>
                    {props => (
                        <span className={classes.differenceOuter}>
                            <Typography 
                                style={{
                                    color: difference > 0 ? 'green' : 'red',
                                    opacity: props.number,
                                    top: 0 - (50 * (1 - props.number)),
                                }}
                                hidden={difference === 0} 
                                className={classes.difference}>
                                    {difference > 0 ? '+' : ''}{difference}
                            </Typography>
                        </span>)}
                </Spring>) : ''}
            <Spring
                from={{number: prev}}
                to={{number: val}}
                config={{
                    mass: 1,
                    tension: 140,
                    friction: 60,
                }}>
                {props => <>{Math.round(props.number)}</>}
            </Spring>
        </>
    );
}

export default withStyles(styles)(RunningCounter);