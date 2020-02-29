import React from 'react';
import { AnyAction } from 'redux';
import RehydrateWrapper from './components/Wrappers/RehydrateWrapper';
import Route from './route';
import { ThunkDispatch } from 'redux-thunk';
import OfflineWrapper from './components/Wrappers/OfflineWrapper';
import ServiceWorkerUpdateWrapper from './components/Wrappers/ServiceWorkerUpdateWrapper';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { lightTheme, darkTheme } from './theme';
import { CssBaseline } from '@material-ui/core';
import { IAppState } from './store';
import { connect } from 'react-redux';
import { UiMode } from './store/profile';

interface IProps {
    uiMode: UiMode;
}

const ThemeWrapper: React.FC<IProps> = ({
    uiMode,
}) => {
    return (
        <MuiThemeProvider theme={uiMode === 'light' ? lightTheme : darkTheme}>
            <CssBaseline />
            <RehydrateWrapper>
                <OfflineWrapper>
                    <ServiceWorkerUpdateWrapper>
                        <Route />
                    </ServiceWorkerUpdateWrapper>
                </OfflineWrapper>
            </RehydrateWrapper>
        </MuiThemeProvider>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        uiMode: store.profile.userProfile !== null ? store.profile.userProfile.uiMode : 'light',
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ThemeWrapper);
