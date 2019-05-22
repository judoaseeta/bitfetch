import { config } from 'aws-sdk';
import endpoints from './endpoints';
import SigV4Client, { CommonObject } from './sigV4Client';
import getCredentials from './getCredentials';
import getUserToken from './getUserToken';

type SignedApiInput = {
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
     region = "us-east-2"
    }: SignedApiInput) {
    try {
        const token = await getUserToken();
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
                method,
                path,
                header,
                queryParams,
                body
            });

            body = body ? JSON.stringify(body) : body;

            const results =  await fetch(url,{
                method,
                headers,
                body
            });
            if (results.status !== 200) {
                throw new Error(await results.text());
            }
            return results.json();
        }

    } catch(e) {
        return e.message;
    }
}
export default signedApi;
