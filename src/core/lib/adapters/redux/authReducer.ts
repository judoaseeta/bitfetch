import { Reducer } from 'redux';
import { AuthActions, ActionTypes } from './authEpics';
import { State, initialState} from './authState';

export const reducer: Reducer<State, AuthActions> = (state = initialState, action) => {
    switch(action.type) {
        case ActionTypes.AUTH_ERROR:
            return {
                ...state,
                authError: action.payload,

            };
        case ActionTypes.SIGN_IN_SUCCESS :
            return {
                ...state,
                isSignIn: true,
                email: action.payload.email
            };
        case ActionTypes.SIGN_UP_SUCCESS :
            return {
                ...state,
                isSignUp: true
            };
        case ActionTypes.SIGN_OUT_SUCCESS :
            return {
                ...state,
                isSignIn: false,
                email: ''
            };
        case ActionTypes.SSR_SIGN_IN :
            return {
                ...state,
                isSignIn: true,
                email: action.payload.email
            };
        default:
            return state;
    }
};

export default reducer;