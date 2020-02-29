import React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

interface IProps {
    rehydrated: boolean;
    children: React.ReactNode;
}

const RehydrateWrapper: React.FC<IProps> = ({
    rehydrated,
    children,
}) => {
    if (rehydrated) {
        return (
            <>{children}</>
        );
    }
    else {
        return (<></>);
    }
}

const mapStateToProps = (store: IAppState) => {
    return {
        rehydrated: store.rehydrated.rehydrated,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RehydrateWrapper);