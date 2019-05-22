import * as React from 'react';
import { HelmetData } from 'react-helmet';
import { config } from 'dotenv';
import { AuthOptions } from '@aws-amplify/auth/lib/types/Auth';
import { RootState } from '../containers';
config();

/*
    Arguments:
        @state = getState from redux Store
        @helmet = static string value from Helmet
        @doms = static string value of React Components.
*/
const Html: React.SFC<{
    authConfig: AuthOptions;
    state: RootState,
    helmet: HelmetData;
    doms: string;
}> = ({ authConfig, state, helmet, doms }) => {
    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();
    const NODE_ENV = process.env.NODE_ENV;
    return (
        <html
            {...htmlAttrs}
        >
        <head>
            {helmet.title.toComponent()}
            {helmet.meta.toComponent()}
            {helmet.link.toComponent()}
            {
                NODE_ENV === 'development'
                    ? <link
                        href={`/static/client.${process.env.CSS_VERSION}.css`}
                        rel="stylesheet"
                    />
                    : <link
                        href={`https://s3.${process.env.REGION}.amazonaws.com/${process.env.BUCKET}/styles.${process.env.VERSION}.css`}
                        rel="stylesheet"
                    />
            }
        </head>
        <body
            {...bodyAttrs}
        >
        <div id="app" dangerouslySetInnerHTML={{
            __html: doms
        }}/>
        <script
            charSet="UTF-8"
            dangerouslySetInnerHTML={{
                __html:`
                window.__initialData__= ${JSON.stringify(state).replace(/</g, '\\u003c')},
                window.__authConfig__= ${JSON.stringify(authConfig).replace(/</g, '\\u003c')}`,
            }} />
        {
            NODE_ENV === 'development'
                ? <script
                    charSet="UTF-8"
                    type="text/javascript"
                    crossOrigin="true"
                    src={`/static/client.${process.env.VERSION}.js`}/>
                : <script
                    charSet="UTF-8"
                    type="text/javascript"
                    crossOrigin="true"
                    src={`https://s3.${process.env.REGION}.amazonaws.com/${process.env.BUCKET}/client.${process.env.VERSION}.js`}
                />
        }
        </body>
        </html>
    );
};
export default Html;
