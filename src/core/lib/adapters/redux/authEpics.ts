import {Epic, ofType} from "redux-observable";
import {ActionWithPayload} from "../../../../utils/redux/createAction";
import {catchError, map, mergeMap, tap} from "rxjs/operators";
import {from, of} from "rxjs";

import {ActionsUnion, createAction} from "../../../../utils/redux/createAction";

// entities

import User from '../../entities/user';
import Credential, { SignUpCredential } from '../../entities/credential';

// useCases
import SignInInteractor from '../../useCases/authentication/signInInteractor';
import SignUpInteractor from '../../useCases/authentication/signUpInteractor';

//services
import { AuthService } from '../../services/authentication';

export enum ActionTypes {
    REQUEST_COIN_LIST = 'REQUEST_COIN_LIST',
    COIN_LIST_TO_STATE = 'COIN_LIST_TO_STATE',
    AUTH_ERROR = 'AUTH_ERROR',
    SIGN_IN = 'SIGN_IN',
    SIGN_OUT = 'SIGN_OUT',
    SIGN_UP = 'SIGN_UP',
    SIGN_IN_SUCCESS = "SIGN_IN_SUCCESS",
    SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS",
    SIGN_OUT_SUCCESS = "SIGN_OUT_SUCCESS",
    SSR_SIGN_IN = 'SSR_SIGN_IN',
}

export const SSRActions = {
    SSR_SIGN_IN: (payload: User) => createAction(ActionTypes.SSR_SIGN_IN, payload)
}
export const authPresenterActions = {
    SIGN_IN:(payload: Credential) => createAction(ActionTypes.SIGN_IN, payload),
    SIGN_UP:(payload: SignUpCredential) => createAction(ActionTypes.SIGN_UP, payload),
    SIGN_OUT:() => createAction(ActionTypes.SIGN_OUT),
};

const authActions = {
    AUTH_ERROR: (payload: string) => createAction(ActionTypes.AUTH_ERROR, payload),
    SIGN_IN_SUCCESS:(payload: User) => createAction(ActionTypes.SIGN_IN_SUCCESS, payload),
    SIGN_UP_SUCCESS: () => createAction(ActionTypes.SIGN_UP_SUCCESS),
    SIGN_OUT_SUCCESS: () => createAction(ActionTypes.SIGN_OUT_SUCCESS),
    ...authPresenterActions,
    ...SSRActions
};

export type AuthActions = ActionsUnion<typeof authActions>;

const SignInEpic: Epic<AuthActions> = (action$) => action$.pipe(
    ofType<AuthActions, ActionWithPayload<ActionTypes.SIGN_IN, Credential>>(ActionTypes.SIGN_IN),
    mergeMap((d) =>from(new SignInInteractor(AuthService).signIn(d.payload)).pipe(
        tap(d=> console.log('console from', d)),
        map( d => {
            if(typeof d === 'string') return authActions.AUTH_ERROR(d);
            return authActions.SIGN_IN_SUCCESS(d);
        }),
        catchError((e) => of(authActions.AUTH_ERROR(e.code))),
        )
    ),
);
const SignUpEpic: Epic<AuthActions> = (action$) => action$.pipe(
    ofType<AuthActions, ActionWithPayload<ActionTypes.SIGN_UP, SignUpCredential>>(ActionTypes.SIGN_UP),
    mergeMap((d) =>from(new SignUpInteractor(AuthService).signUp(d.payload)).pipe(
        tap(d => console.log(d)),
        map( () => authActions.SIGN_UP_SUCCESS()),
        catchError((e) => of(authActions.AUTH_ERROR(e.code))),
        )
    )
);
const SignOutEpic: Epic<AuthActions> = (action$) => action$.pipe(
    ofType<AuthActions>(ActionTypes.SIGN_OUT),
    mergeMap(() => from(AuthService.signOut()).pipe(
        map(() => authActions.SIGN_OUT_SUCCESS())
        )
    )
);

export const epics = [ SignInEpic, SignUpEpic, SignOutEpic ];