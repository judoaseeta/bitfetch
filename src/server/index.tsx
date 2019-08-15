import * as React from 'react';
import * as express from 'express';
import { Request } from 'express';
import * as cors from 'cors';

import { AuthOptions } from '@aws-amplify/auth/lib/types/Auth';
import { config } from 'dotenv';
import * as cookieParser from 'cookie-parser';

import * as path from 'path';
import Authenticate from './middlewares/Authenticate';
import Render from './middlewares/Render';

// webpack related-codes for development

import * as webpack from 'webpack';
import * as webpackHotMiddleWare from 'webpack-hot-middleware';
import * as webpackDevMiddleWare from 'webpack-dev-middleware';
import clientConfig from '../../webpack.client.dev';

// types for authenticate extends express type "Request"
export interface RequestWithVerified extends Request {
    verified? : boolean;
    validated?: boolean;
    email?: string;
    name?: string;
    authConfig? : AuthOptions;
}
config();
console.log(process.env.NODE_ENV);
const authConfig: AuthOptions = {
    region: process.env.REGION!,
    identityPoolId :  process.env.identityPoolId!,
    userPoolId : process.env.userPoolId!,
    userPoolWebClientId: process.env.userPoolWebClientId!,
    mandatorySignIn: true,
    cookieStorage: {
        domain:'localhost',
        path: '/',
        expires: 365,
        secure: false,
    }
};
const app = express();
app.use((req: RequestWithVerified,res, next) => {
    req.authConfig = authConfig;
    next();
})
app.use(cors());

app.use(cookieParser());
app.use(Authenticate);
if(process.env.NODE_ENV === 'development') {
    const serverConfig = require('../../webpack.server.dev.js');
    const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
    const compiler = webpack(clientConfig);
    const devMiddleware = webpackDevMiddleWare(compiler, {
        publicPath: '/static',
        serverSideRender: true,
        stats: {
            colors: true,
        },
    });
    const hotMiddleware = webpackHotMiddleWare(compiler ,{
        reload: true
    });
    // const hotServerWare = webpackHotServerMiddleware(compiler);
    app.use(devMiddleware);
    app.use(hotMiddleware);
    app.use('/static', express.static(path.join(process.cwd(), 'dev/client')));
    // app.use(hotServerWare);
} else {
    app.use('/static', express.static(path.join(process.cwd(), 'prod/client')));

}
app.use(Render);
app.listen(`${process.env.PORT}`, () => console.log('listen'));
export default app;
