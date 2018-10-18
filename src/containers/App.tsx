import * as React from 'react';

import {Route, RouteComponentProps, Switch, withRouter} from 'react-router-dom';


import {connect, MapDispatchToProps, MapStateToProps} from 'react-redux';
import { bindActionCreators, Dispatch, Reducer } from 'redux';
import {ActionsObservable, Epic, ofType} from 'redux-observable';

import { from, of } from 'rxjs';
import {map, mergeMap, tap } from 'rxjs/operators';

import {ActionsUnion, ActionWithPayload, createAction} from '../utils/createAction';


import * as styles from './styles/App.scss';
// dumb components

import Helmet from '../utils/HelmetCompo';
import Header from './Nav';
import TestCompo from './TestCompo';
import { RootState } from './';

import TradeSystem from '../components/TradeSystem/';


//utilities
import {coinListUrl} from "../utils/api";
import coinListMapper from "../utils/coinListMapper";

/*
    Design App's code structure under DUCKS pattern.
    each Container file has ActionTypes, ActionDispatchers, Epics, Reducer
    as well as Container Component and its redux-connect
*/

// Definitions for Action Types

export enum ActionTypes {
    REQUEST_COIN_LIST = 'REQUEST_COIN_LIST',
    COIN_LIST_TO_STATE = 'COIN_LIST_TO_STATE',
    TEST_SSR = 'TEST_SSR',
    NOTI = 'NOTI'
}

// Action Dispatchers.

export const dispatchers = {
    REQUEST_COIN_LIST: () => createAction(ActionTypes.REQUEST_COIN_LIST),
    COIN_LIST_TO_STATE: (payload: Map<string, any>) => createAction(ActionTypes.COIN_LIST_TO_STATE, payload),
    TEST_SSR: (payload: string) => createAction(ActionTypes.TEST_SSR, payload),
    NOTI: () => createAction(ActionTypes.NOTI)
};

type Actions = ActionsUnion<typeof dispatchers>;

// Epics.

const CoinListEpic: Epic<Actions> = (action$: ActionsObservable<Actions>) => action$.pipe(
    ofType(ActionTypes.REQUEST_COIN_LIST),
    mergeMap(action$ =>
        from(fetch(coinListUrl).then((res: any) => res.json())).pipe(
            map(data => coinListMapper(data)),
            map(data => new Map(Object.entries(data))),
            tap(data => console.log(data)),
            map(data => dispatchers.COIN_LIST_TO_STATE(data)),
        )
    )
);
const TestSsrEpic: Epic<Actions> = (action$: ActionsObservable<Actions>) => action$.pipe(
    ofType<Actions, ActionWithPayload<ActionTypes.TEST_SSR, string>, ActionTypes.TEST_SSR>(ActionTypes.TEST_SSR),
    tap((d) => console.log(d.payload)),
    map(() => dispatchers.NOTI())
);
export const epics = [ CoinListEpic, TestSsrEpic ];
// Reducers.
interface AppReducer {
    coinList: null | Map<string, any>;
    loaded: boolean;
}
const initialState = {
    coinList: null,
    loaded: false
};

export const reducer: Reducer<AppReducer, Actions> = (state = initialState, action) => {
    switch(action.type) {
        case ActionTypes.COIN_LIST_TO_STATE:
            return {
                ...state,
                coinList: action.payload,
                loaded: true
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
declare namespace App {
    export type Props = ReturnType<typeof MapStateToProps>
    & ReturnType<typeof MapDispatchToProps>
        & RouteComponentProps;
    export type State = {
        coinList: Map<string, any> | null;
        loaded: boolean
    }
}
/*
map(keyword => this.state.coinKeys.filter(key => key.includes(keyword.toUpperCase()))),
            map(filteredCoinKeys => filteredCoinKeys.map(key => this.state.coinList[key]))
*/
export class App extends React.Component<App.Props, App.State> {
    state = {
        coinList: null,
        loaded: false,
    };
    static getDerivedStateFromProps(props: App.Props,state: App.State) {
        if(props.loaded && state.coinList !== props.coinList){
            return {
                coinList: props.coinList,
                loaded: true
            }
        }
        return null;
    }
    componentDidMount() {
        if(!this.props.coinList) {
            this.props.REQUEST_COIN_LIST();
        }
    }
    componentDidUpdate() {
        console.log(this.props);
    }
    render() {
        return (
            <div
                className={styles.container}
            >
                <Helmet
                    title="Bitfetch: The best"
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
                <Header
                    coinList={this.state.coinList!}
                    loaded={this.state.loaded}
                />
                <main>
                    <Switch>
                        <Route
                            path="/"
                            exact
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
                            path='/test'
                            render={() =>
                                <div>test</div>
                            }
                        />
                    </Switch>
                </main>
            </div>
        )
    }
}

export default withRouter(connect(MapStateToProps, MapDispatchToProps)(App));

