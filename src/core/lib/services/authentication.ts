
import Auth, { AuthClass } from '@aws-amplify/auth';

import User, {UserInfo} from '../entities/user';
import Credential, { SignUpCredential } from '../entities/credential';
import { SignInService } from '../useCases/authentication/signInInteractor';
import { SignUpService } from '../useCases/authentication/signUpInteractor';
class AuthenticationService implements SignInService, SignUpService {
    Auth: AuthClass;
    constructor() {
        this.Auth = Auth;
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
        this.signOut = this.signOut.bind(this);
    }
    async signIn(credential : Credential) {
        try {
            await this.Auth.signIn(credential.email, credential.password);
            const userInfo = await this.getUser();
            return userInfo;
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
    }
    async signUp (credential: SignUpCredential) {
        try {
            await this.Auth.signUp({
                username: credential.email,
                password: credential.password,
                attributes: { name }});
            return true;
        } catch(e) {
            throw e;
        }
    };
    async signOut () {
        try {
            await this.Auth.signOut();
        } catch (e) {
            throw e;
        }
    }
    async getUser() {
        try {
            console.log('getting');
            const user = await this.Auth.currentSession();
            return await new User(user.getIdToken().decodePayload() as UserInfo);
        } catch(e) {
            throw e;
        }
    }
    async getUserToken() {
        try {
            const user = await this.Auth.currentSession();
            return await user.getIdToken().getJwtToken();
        } catch(e) {
            console.log(e);
            throw new Error(e);
        }
    }
}
export const AuthService =  new AuthenticationService();

