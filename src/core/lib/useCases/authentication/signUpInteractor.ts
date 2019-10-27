import { SignUpCredential } from '../../entities/credential';
export interface SignUpService {
    signUp: (credential: SignUpCredential) => Promise<boolean>;
}

class SignUpInteractor {
    signUpService: SignUpService
    constructor(service: SignUpService) {
        this.signUpService = service;
    }
    async signUp(credential: SignUpCredential) {
        return this.signUpService.signUp(credential);
    }
}
export default SignUpInteractor;
