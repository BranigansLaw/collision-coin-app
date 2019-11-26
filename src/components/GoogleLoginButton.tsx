import React from 'react';
import { 
    GoogleLogin,
    GoogleLoginResponse, 
    GoogleLoginResponseOffline
} from 'react-google-login';

const GoogleLoginButton: React.FC = () => {
    const success = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if (instanceOfGoogleLoginResponseOffline(res)) {
            // Throw an error
        }
        else {
            debugger;
            const loginResponse: GoogleLoginResponse = res as GoogleLoginResponse;
            const idToken: string = loginResponse.getAuthResponse().id_token;
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

export default GoogleLoginButton;