import * as React from 'react';
import {Route, RouteComponentProps, Switch, withRouter} from 'react-router-dom';


import {connect} from 'react-redux';
import { bindActionCreators, Dispatch, Reducer } from 'redux';
import {ActionsObservable, Epic, ofType} from 'redux-observable';

import { from, of } from 'rxjs';
import {catchError, map, mergeMap, tap} from 'rxjs/operators';

import {ActionsUnion, ActionWithPayload, createAction} from '../utils/createAction';


import * as styles from './styles/App.scss';
// dumb components

import Helmet from '../utils/HelmetCompo';
import AuthForm from './AuthForm';
import Confirm from './Confirm';
import ExtendSearch from './ExtendSearch';
import Header from './Nav';
import TestCompo from './TestCompo';
import { RootState } from './';

import AccountCompo from '../components/account/Account';
import TradeSystem from '../components/tradeSystem/';
// import ExtendSearch from '../components/extendSearch/ExtendSearch';

//utilities
import {coinListUrl} from "../utils/api";
import coinListMapper from "../utils/coinListMapper";
import {signIn, signUp} from "../utils/Auth";
import TriggeredRoute from "../utils/TriggeredRoute";

/*
    Design App's code structure under DUCKS pattern.
    each Container file has ActionTypes, ActionDispatchers, Epics, Reducer
    as well as Container Component and its redux-connect
*/

// Definitions for Action Types

export enum ActionTypes {
    REQUEST_COIN_LIST = 'REQUEST_COIN_LIST',
    COIN_LIST_TO_STATE = 'COIN_LIST_TO_STATE',
    AUTH_ERROR = 'AUTH_ERROR',
    SIGN_IN = 'SIGN_IN',
    SIGN_OUT = 'SIGN_OUT',
    SIGN_UP = 'SIGN_UP',
    SIGN_IN_SUCCESS = "SIGN_IN_SUCCESS",
    SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS",
}
export interface AuthInfo {
    username: string;
    password: string;
}
export interface SignUpInfo extends AuthInfo {
    name: string;
}
export interface UserInfo {
    name: string;
    email: string;
}
// Action Dispatchers.
export const authActions = {
    AUTH_ERROR: (payload: string) => createAction(ActionTypes.AUTH_ERROR, payload),
    SIGN_IN:(payload: AuthInfo) => createAction(ActionTypes.SIGN_IN, payload),
    SIGN_UP:(payload: SignUpInfo) => createAction(ActionTypes.SIGN_UP, payload),
    SIGN_OUT:() => createAction(ActionTypes.SIGN_OUT),
    SIGN_IN_SUCCESS:(payload: UserInfo) => createAction(ActionTypes.SIGN_IN_SUCCESS, payload),
    SIGN_UP_SUCCESS: () => createAction(ActionTypes.SIGN_UP_SUCCESS),
};
export const dispatchers = {
    REQUEST_COIN_LIST: () => createAction(ActionTypes.REQUEST_COIN_LIST),
    COIN_LIST_TO_STATE: (payload: Map<string, any>) => createAction(ActionTypes.COIN_LIST_TO_STATE, payload),
    ...authActions
};

type Actions = ActionsUnion<typeof dispatchers>;

// Epics.
/*
* The reason why place CoinListEpic here is it need to be fired when App is loaded first.
*
* */
const CoinListEpic: Epic<Actions> = (action$: ActionsObservable<Actions>) => action$.pipe(
    ofType(ActionTypes.REQUEST_COIN_LIST),
    mergeMap(() =>
        from(fetch(coinListUrl).then((res: any) => res.json())).pipe(
            map(data => coinListMapper(data)),
            map(data => new Map(Object.entries(data))),
            tap(d => console.log(d)),
            map(data => dispatchers.COIN_LIST_TO_STATE(data)),
        )
    )
);
const SignInEpic: Epic<Actions> = (action$) => action$.pipe(
    ofType<Actions, ActionWithPayload<ActionTypes.SIGN_IN, AuthInfo>>(ActionTypes.SIGN_IN),
    mergeMap((d) =>from(signIn(d.payload)).pipe(
        tap(d=> console.log('console from', d)),
        map( d => {
            if(typeof d === 'string') return dispatchers.AUTH_ERROR(d);
            return dispatchers.SIGN_IN_SUCCESS(d!);
        }),
        catchError((e) => of(dispatchers.AUTH_ERROR(e.code))),
        )
    ),
);
const SignUpEpic: Epic<Actions> = (action$) => action$.pipe(
    ofType<Actions, ActionWithPayload<ActionTypes.SIGN_UP, SignUpInfo>>(ActionTypes.SIGN_UP),
    mergeMap((action$) =>from(signUp(action$.payload)).pipe(
        tap(d => console.log(d)),
        map( () => dispatchers.SIGN_UP_SUCCESS()),
        catchError((e) => of(dispatchers.AUTH_ERROR(e.code))),
        )
    )
);
export const epics = [ CoinListEpic, SignInEpic,SignUpEpic ];
// Reducers.
interface AppReducer {
    coinList: null | Map<string, CoinListData>;
    loaded: boolean;
    auth: {
        isSignIn: boolean;
        isSignUp: boolean;
        authError: string;
        email:string,
    }
}
const initialState = {
    coinList: null,
    loaded: false,
    auth: {
        isSignIn: false,
        isSignUp: false,
        authError: '',
        email:''
    },
};

export const reducer: Reducer<AppReducer, Actions> = (state = initialState, action) => {
    switch(action.type) {
        case ActionTypes.COIN_LIST_TO_STATE:
            return {
                ...state,
                coinList: action.payload,
                loaded: true
            };
        case ActionTypes.AUTH_ERROR:
            return {
                ...state,
                auth: {
                    ...state.auth,
                    authError: action.payload,
                }
            };
        case ActionTypes.SIGN_IN_SUCCESS :
            return {
                ...state,
                auth: {
                    ...state.auth,
                    isSignIn: true,
                    email: action.payload.email
                }
            };
        case ActionTypes.SIGN_UP_SUCCESS :
            return {
                ...state,
                auth: {
                    ...state.auth,
                    isSignUp: true
                }
            };
        default: return state;
    }
};

const MapStateToProps = (state: RootState) => ({
    coinList: state.main.coinList,
    loaded: state.main.loaded
});
const MapDispatchToProps = (dispatch: Dispatch) => ({
    ...bindActionCreators({
        ...dispatchers
    }, dispatch)
});

/*
map(keyword => this.state.coinKeys.filter(key => key.includes(keyword.toUpperCase()))),
            map(filteredCoinKeys => filteredCoinKeys.map(key => this.state.coinList[key]))
*/

export class App extends React.Component<Props, {}> {
    componentDidMount() {
        if(!this.props.coinList) {
            this.props.REQUEST_COIN_LIST();
        }
    }
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.log(error, errorInfo);
    }

    render() {
        return (
            <div
                className={styles.container}
            >
                <Helmet
                    title="Bitfetch: The best platform for CryptoCurrency"
                    metas={[
                        {
                            name: 'description',
                            content: 'Bitfetch - virtual trading, live chart for crypto currencies',
                        },
                        {
                            name: 'author',
                            content: 'Bitcoin, CryptoCurrencies, Ethereum',
                        },
                    ]}
                />
                <Header />
                <main
                    className={styles.innerContainer}
                >
                    <Switch>
                        <Route
                            path="/"
                            exact
                            component={TestCompo}
                        />
                        <TriggeredRoute
                            path='/triggered'
                            component={TestCompo}
                        />
                        <Route
                            path="/market"
                            render={() => <div>Market</div>}
                        />
                        <Route
                            path="/currencies/:fsym"
                            component={TradeSystem}
                        />
                        <Route
                            path="/search/:fsym"
                            component={ExtendSearch}
                        />
                        <Route
                            path='/test'
                            render={() =>
                                <div>test</div>
                            }
                        />
                        <TriggeredRoute
                            path='/account'
                            component={AccountCompo}
                        />
                        <TriggeredRoute
                            isAuthNeeded={false}
                            path='/auth/:type'
                            component={AuthForm}
                        />
                        <TriggeredRoute
                            isAuthNeeded={false}
                            path='/confirm/:username'
                            component={Confirm}
                        />
                    </Switch>
                </main>
            </div>
        )
    }
}

export type Props = ReturnType<typeof MapStateToProps>
    & ReturnType<typeof MapDispatchToProps>
    & RouteComponentProps;
export default withRouter(connect(MapStateToProps, MapDispatchToProps)(App));

