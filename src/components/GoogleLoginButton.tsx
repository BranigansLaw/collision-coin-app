import React from 'react';
import { 
    GoogleLogin,
    GoogleLoginResponse, 
    GoogleLoginResponseOffline
} from 'react-google-login';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { googleAuthActionCreator } from '../store/auth';

interface IProps {
    googleAuthorize: (googleToken: string) => Promise<void>;
}

const GoogleLoginButton: React.FC<IProps> = ({
    googleAuthorize,
}) => {
    const success = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if (instanceOfGoogleLoginResponseOffline(res)) {
            // Throw an error
        }
        else {
            const loginResponse: GoogleLoginResponse = res as GoogleLoginResponse;

            googleAuthorize(loginResponse.getAuthResponse().id_token);
        }
    };

    function instanceOfGoogleLoginResponseOffline(object: any): object is GoogleLoginResponseOffline {
        return 'code' in object;
    }

    const error = (error: any) => {
    };
    
    return (
        <GoogleLogin
            clientId="459474042581-p2euffeam086gqe632kivgmlnucveb0j.apps.googleusercontent.com"
            buttonText="Google Login"
            onSuccess={success}
            onFailure={error}
            cookiePolicy={'single_host_origin'}
        />
    );
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        googleAuthorize: (googleToken: string) => dispatch(googleAuthActionCreator(googleToken)),
    };
};

export default connect(
    undefined,
    mapDispatchToProps,
)(GoogleLoginButton);