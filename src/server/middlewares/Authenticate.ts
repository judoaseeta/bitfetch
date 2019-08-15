;import { Response, NextFunction } from 'express';
import { RequestWithVerified } from '../';
import { CognitoUserSession, CognitoIdToken, CognitoAccessToken, CognitoRefreshToken } from 'amazon-cognito-identity-js';
import gatherToken from '../../utils/gatherToken';
const Authenticate = (req: RequestWithVerified, res: Response, next: NextFunction) => {
    const tokens = gatherToken(req.cookies);
    const session = new CognitoUserSession({
        IdToken: new CognitoIdToken({ IdToken: tokens.IdToken}),
        AccessToken: new CognitoAccessToken({ AccessToken: tokens.AccessToken}),
        RefreshToken: new CognitoRefreshToken({ RefreshToken: tokens.RefreshToken})
    });
    const { email_verified, email,name } = session.getIdToken().decodePayload();

    if(session.isValid()) {
        req.validated = true;
        req.verified = email_verified;
        req.email = email;
        req.name = name;
        next();
    } else {
        req.validated = false;
        next();
    }
};

export default Authenticate;