// utility funcion for gathering token from cookie;

import { config } from 'dotenv';
config();
type GatheredToken = {
    AccessToken: string;
    IdToken: string;
    RefreshToken: string;
}
const gatherToken = (cookies: { [key: string] : string }) => {
    let returnedToken: GatheredToken = {
        AccessToken: '',
        IdToken: '',
        RefreshToken: ''
    };
    const keys = Object.keys(cookies).filter(cookie => cookie.includes(process.env.userPoolWebClientId!));
    keys.forEach(key => {
        if(key.includes('idToken')) returnedToken['IdToken'] = cookies[key];
        else if (key.includes('accessToken')) returnedToken['AccessToken'] = cookies[key];
        else if (key.includes('refreshToken')) returnedToken['RefreshToken'] = cookies[key];
    });
    return returnedToken;
};

export default gatherToken;