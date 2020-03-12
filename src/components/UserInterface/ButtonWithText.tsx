import React from 'react';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { Typography, ButtonProps, Button, WithStyles, createStyles, withStyles, Grid } from '@material-ui/core';

const iconButtonWithTextStyles = (theme: Theme) => createStyles({
    root: {
        height: theme.spacing(8),
        width: theme.spacing(8),
        padding: 0,
        borderRadius: 10,
        color: 'inherit',
    },
    text: {
        fontSize: theme.spacing(1),
    },
});

interface IconButtonWithTextProps extends WithStyles<typeof iconButtonWithTextStyles> {
    text: string;
}

class ButtonWithText extends React.Component<ButtonProps & IconButtonWithTextProps> {
    render(){
        const {
            classes,
            className,
            text,
            children,
            ...buttonProps
        } = this.props;
    
        return (
            <Button className={`${className !== undefined ? className : ''} ${classes.root}`} {...buttonProps}>
                <Grid container direction="column" justify="center" alignItems="center">
                    <Grid item>
                        {children}
                    </Grid>
                    <Grid item>
                        <Typography className={classes.text}>{text}</Typography>
                    </Grid>
                </Grid>
            </Button>);
    }
}

export default withStyles(iconButtonWithTextStyles)(ButtonWithText);