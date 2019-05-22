import Auth from '@aws-amplify/auth';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { AuthInfo, SignUpInfo } from '../containers/App';
import getUser from './getUser';

export const signIn  = async({ username, password }: AuthInfo) => {
    try {
        await Auth.signIn(username, password);
        const userInfo = await getUser() ;
        if(userInfo) {
            return { name: userInfo.name, email: userInfo.username};
        }
        return 'can\'t get user information';
    } catch(e) {
        throw e;
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