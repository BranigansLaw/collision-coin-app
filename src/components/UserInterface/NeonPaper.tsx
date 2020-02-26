import React from 'react';
import { WithStyles, createStyles, withStyles, Theme, PaperProps, Paper, TypographyProps, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import FabWithHidden from './FabWithHidden';

const lightNeonPaperTextClassName: string = 'light-neon-text';
const darkNeonPaperTextClassName: string = 'dark-neon-text';

const styles = (theme: Theme) => createStyles({
    root: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        margin: 8,
    },
    normalDensity: {
        padding: theme.spacing(2),
    },
    denseDensity: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(1.5),
        paddingRight: theme.spacing(1.5),
    },
    expandButton: {
        float: 'right',
    },
    green: {
        borderColor: 'rgb(0, 255, 0)',
        '& .MuiFab-root': {
            color: 'rgb(0, 255, 0)',
        },
        '& .light-neon-text': {
            color: 'rgb(0, 255, 0)',
        },
        '& .dark-neon-text': {
            color: 'rgb(0, 150, 0)',
        },
    },
    orange: {
        borderColor: 'rgb(155, 155, 0)',
        '& .light-neon-text': {
            color: 'rgb(155, 155, 0)',
        },
        '& .dark-neon-text': {
            color: 'rgb(75, 75, 0)',
        },
    },
});

interface IProps extends WithStyles<typeof styles> {
    color: ('green' | 'orange');
    density: ('normal' | 'dense');
    hasExpander?: boolean;
}

const NeonPaper: React.FC<IProps & PaperProps> = ({
    classes,
    children,
    className,
    style,
    color,
    density,
    hasExpander,
    ...rest
}) => {
    const getDensityClass = () => {
        switch (density) {
            case "dense":
                return classes.denseDensity;
            case "normal":
                return classes.normalDensity;
        }
    }

    const getColorClass = () => {
        switch (color) {
            case "green":
                return classes.green;
            case "orange":
                return classes.orange;
        }
    }

    return (
        <Paper
            variant="outlined"
            className={`${className} ${classes.root} ${getDensityClass()} ${getColorClass()}`} 
            {...rest}>
                <FabWithHidden className={classes.expandButton} size="small" onClick={() => alert('Expand')} hidden={!hasExpander}>
                    <ExpandMoreIcon />
                </FabWithHidden>
                {children}
        </Paper>
    );
}

export default withStyles(styles)(NeonPaper);

interface INeonPaperTypographyProps {
    shade: ('light' | 'dark');
}

export const NeonPaperTypography: React.FC<INeonPaperTypographyProps & TypographyProps> = ({
    className,
    shade,
    children,
    ...rest
}) => {
    return (
        <Typography className={`${className} ${shade === 'light' ? lightNeonPaperTextClassName : darkNeonPaperTextClassName}`} {...rest}>
            {children}
        </Typography>
    );
}