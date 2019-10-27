import { config } from 'aws-sdk';
import endpoints from './endpoints';
import SigV4Client, { CommonObject } from './sigV4Client';
import getCredentials from '../auth/getCredentials';
import getUserToken from '../auth/getUserToken';
export type SignedApiInput = {
    method: string;
    endpointName: string;
    path: string;
    header?: CommonObject;
    queryParams?: CommonObject
    body?: any;
    region?: string

}
async function signedApi(
    {
     method ,
     endpointName,
     path,
     header = {},
     queryParams = {},
     body = undefined,
     region = "us-east-2",

    }: SignedApiInput) {
    try {
        // get token and gather credentials
        const token = await getUserToken();

        const upperedMethod = method.toUpperCase();
        await getCredentials(token);
        const { credentials } = config;

        if(credentials) {
            const signedRequest = SigV4Client({

                accessKey: credentials.accessKeyId,
                secretKey: credentials.secretAccessKey,
                sessionToken: credentials.sessionToken!,
                region: region,
                endpoint:endpoints[endpointName],

            });

            const { url, headers } = signedRequest({
                method: upperedMethod,
                path,
                header,
                queryParams,
                body
            });

            body = body ? JSON.stringify(body) : body;

            const results =  await fetch(url,{
                method: upperedMethod,
                headers,
                body
            });
            if (results.status !== 200) {
                throw results.json();
            }
            return results.json();
        }

    } catch(e) {
        return e;
    }
}
export default signedApi;
