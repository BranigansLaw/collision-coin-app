import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { Stepper, Step, StepButton, Button, Grid, useTheme } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { IAppState } from '../../store';
import Slide1 from './loading-slide1.png';
import Slide2 from './loading-slide2.png';
import Slide3 from './loading-slide1.png';
import { push } from 'connected-react-router';
import { RootUrls } from '../../route';

declare module '*.png'

const styles = (theme: Theme) => createStyles({
    root: {
    },
    stepper: {
        backgroundColor: 'transparent',
        '& .MuiStepIcon-text': {
            display: 'none',
        },
    },
    img: {
        height: '60vh',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
    },
});

interface IProps extends WithStyles<typeof styles> {
    firstSyncCompleted: boolean;
    push: (path: string) => void;
}

const DataSyncSlideshow: React.FC<IProps> = ({
    firstSyncCompleted,
    push,
    classes,
}) => {
    const steps = [
        {
            imgPath: Slide1,
            label: 'Step 1',
        },
        {            
            imgPath: Slide2,
            label: 'Step 2',
        },
        {
            imgPath: Slide3,
            label: 'Step 3',
        },
    ];

    const [activeStep, setActiveStep] = React.useState(0);

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    return (
        <Grid container direction="column">
            <SwipeableViews
                axis={useTheme().direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {steps.map((step, index) => (
                    <div key={index}>
                        {Math.abs(activeStep - index) <= 2 ? (
                            <div className={classes.img} style={{backgroundImage: `url(${step.imgPath})`}} />
                        ) : null}
                    </div>
                ))}
            </SwipeableViews>
            <Stepper nonLinear activeStep={activeStep} className={classes.stepper}>
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepButton onClick={() => handleStepChange(index)} />
                    </Step>
                ))}
            </Stepper>
            <Button 
                disabled={!firstSyncCompleted} 
                onClick={() => push(RootUrls.dashboard())}>
                    {firstSyncCompleted ? 'Continue' : 'Loading your profile ...'}
            </Button>
        </Grid>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        firstSyncCompleted: store.sync.lastSyncEpochMilliseconds !== 0,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        push: (path: string) => dispatch(push(path)),
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(DataSyncSlideshow));