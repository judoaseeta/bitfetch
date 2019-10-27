import Credential from '../../entities/credential';
import User from '../../entities/user';

export interface SignInService {
    signIn: (authCredential: Credential ) => Promise<User>;
}

class SignInInteractor {
    signInService: SignInService;
    constructor( signInService: SignInService) {
        this.signInService = signInService
    }
    async signIn(authCredential: Credential): Promise<User> {
        return this.signInService.signIn(authCredential);
    }
}

export default SignInInteractor;
