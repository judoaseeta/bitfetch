import * as auth0js from 'auth0-js';
import { WebAuth } from 'auth0-js';
class Auth {
    auth0js: WebAuth | null = null;
    constructor() {
        this.auth0js = new WebAuth({
            clientID:'QLKG1w0tteXxIhNxWURpEVnIWsghxIGK',
            domain: 'mitoo.auth0.com',
        });

    }
}