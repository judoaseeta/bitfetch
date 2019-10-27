export type State = {
    isSignIn: boolean;
    isSignUp: boolean;
    authError: string;
    email: string;
}
export const initialState: State = {
    isSignIn: false,
    isSignUp: false,
    authError: '',
    email: '',
};



