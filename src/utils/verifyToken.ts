import { decode, verify, JwtHeader } from 'jsonwebtoken';
// @ts-ignore
import * as jwkToPem from 'jwk-to-pem';
import fetch from 'node-fetch';
import {} from 'amazon-cognito-auth-js';
type decodedToken = {
    header: JwtHeader;
    payload: any;
};
// find jwk key with same kid of token's.z
const findJwk = (jwks: jwkToPem.JWK[], tokenHeader: JwtHeader) => jwks.find(jwk => jwk.kid === tokenHeader.kid);
async function verifyToken(token: string): Promise<any> {
    const { header, payload } = decode(token, { complete: true }) as decodedToken;
    try {
        const jwk = await fetch('https://cognito-idp.us-east-2.amazonaws.com/us-east-2_hGzrqTqHD/.well-known/jwks.json');
        const resp = await jwk.json();
        const properJWk = findJwk(resp.keys, header);
        // @ts-ignore
        const pem = await jwkToPem(properJWk);
        return await verify(token, pem, { algorithms: ['RS256']});
    } catch(e) {
        throw e;

    }
}

export default verifyToken;