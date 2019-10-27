import Email from './email';

export interface AuthCredential {
    username: string;
    password: string;
}
export interface ISignUpCredential extends AuthCredential {
    name: string;
}

class Credential {
    _email:Email;
    _password: string;
    constructor(credential: AuthCredential) {
        const validated = validatePw(credential.password);
        if(!!validated) {
            throw new Error(validated)
        }
        this._password =  credential.password;
        this._email = new Email(credential.username);
    }
    get email() {
        return this._email.address;
    }
    get password(){
        return this._password;
    }
}
export class SignUpCredential {
    _email: Email;
    _password: string;
    _name: string;
    constructor(credential: ISignUpCredential) {
        const validated = validatePw(credential.password);
        if(!!validated) {
            throw new Error(validated)
        }
        this._password =  credential.password;
        this._email = new Email(credential.username);
        this._name = credential.name;
    }
    get email() {
        return this._email.address;
    }
    get password(){
        return this._password;
    }
    get name() {
        return this._name;
    }
}
export const pwRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
const pwRegexWithUpperCase = /[A-Z]/;
const pwRegexWithNumber = /\d/;
const pwRegexWithSpecial = /(?=.*[!@#$%^&*])/;
export function validatePw (pw: string) {
    if (pw.length === 0 ) return '';
    else if(!pwRegexWithUpperCase.test(pw)) {
        return 'at least one uppercase letter needed.';
    } else if(!pwRegexWithNumber.test(pw)) {
        return 'at least one number needed.';
    } else if(pw.length > 4 && pw.length < 8) {
        return "at least 8 characters needed.";
    } else if(!pwRegexWithSpecial.test(pw)) {
        return 'at least one special character needed';
    }
    return '';
};

export default Credential;
