import * as React from 'react';
import * as express from 'express';
import { Request } from 'express';
import * as cors from 'cors';

import { AuthOptions } from '@aws-amplify/auth/lib/types/Auth';
import { CognitoUserSession, CognitoIdToken, CognitoAccessToken, CognitoRefreshToken } from 'amazon-cognito-identity-js';
import { config } from 'dotenv';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import * as cookieParser from 'cookie-parser';

import * as path from 'path';
import Authenticate from './middlewares/Authenticate';
import Render from './middlewares/Render';

export interface RequestWithVerified extends Request {
    verified? : boolean;
    validated?: boolean;
    email?: string;
    name?: string;
}
config();
library.add(fab, fas);
const authConfig: AuthOptions = {
    region: process.env.REGION!,
    identityPoolId :  process.env.identityPoolId!,
    userPoolId : process.env.userPoolId!,
    userPoolWebClientId: process.env.userPoolWebClientId!,
    mandatorySignIn: true,
    cookieStorage: {
        domain: '',
        path: '/',
        expires: 365,
        secure: false,
    }
};
console.log(authConfig);
const app = express();
app.use(cors());
app.use('/static', express.static(path.join(process.cwd(), 'dist')));
app.use(cookieParser());
app.use(Authenticate);
app.use(Render(authConfig));
app.listen(`${process.env.PORT}`, () => console.log('start server'));

export default app;