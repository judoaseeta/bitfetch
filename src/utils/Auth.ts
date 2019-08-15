import Auth from '@aws-amplify/auth';
import { AuthInfo, SignUpInfo } from '../containers/App';
import getUser from './getUser';

export const signIn  = async({ username, password }: AuthInfo) => {
    console.log(username,password);
    try {
        console.log(Auth);
        const {user, err} = await Auth.signIn(username, password);
        const userInfo = await getUser();
        if(userInfo) {
            return { name: userInfo.name, email: userInfo.username};
        }
        return 'can\'t get user information';
    } catch(err) {
        if (err.code === 'UserNotConfirmedException') {
            console.log(err);
            throw err;
            // The error happens if the user didn't finish the confirmation step when signing up
            // In this case you need to resend the code and confirm the user
            // About how to resend the code and confirm the user, please check the signUp part
        } else if (err.code === 'PasswordResetRequiredException') {
            console.log(err);
            throw err;
            // The error happens when the password is reset in the Cognito console
            // In this case you need to call forgotPassword to reset the password
            // Please check the Forgot Password part.
        } else if (err.code === 'NotAuthorizedException') {
            console.log(err);
            throw err;
            // The error happens when the incorrect password is provided
        } else if (err.code === 'UserNotFoundException') {
            console.log(err);
            throw err;
            // The error happens when the supplied username/email does not exist in the Cognito user pool
        } else {
            console.log(err);
            throw err;
        }
    }
};
export const signUp = async({username, password, name}: SignUpInfo) => {
    try {
        return await Auth.signUp({
            username,
            password,
            attributes: {
                name
            }
        });
    } catch(e) {
        throw e;
    }
};
export const signOut = () => Auth.signOut();