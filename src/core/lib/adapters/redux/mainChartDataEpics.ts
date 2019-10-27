
import {ActionsUnion, ActionWithPayload, createAction} from "../../../../utils/redux/createAction";
import {ActionsObservable, Epic, ofType} from "redux-observable";
import {catchError, map, startWith, switchMap, takeUntil, tap} from "rxjs/operators";

import {Action} from "redux";
import {from, of} from "rxjs";
import { MappedHistoData ,HistoType  } from '../../entities/histoData';
import CurrencyLiveData from '../../entities/currencyLiveData';
import CryptoApiInterActors from '../../useCases/cryptoApi';
export enum actionTypes {
    CATCH_ERROR = 'CATCH_ERROR',
    REQUEST_INITIAL_DATA = 'REQUEST_INITIAL_DATA',
    REQUEST_SUCCESS =  'REQUEST_SUCCESS',
    LISTEN_CURRENT =  'LISTEN_CURRENT',
    SUBSCRIPTION_TO_STATE = 'SUBSCRIPTION_TO_STATE',
    UNSUBSCRIBE = 'UNSUBSCRIBE',
    CLEAR = 'CLEAR',
    PARTIAL_CLEAR = 'PARTIAL_CLEAR',
    UPDATE_DATA = 'UPDATE_DATA',
    RESET = 'RESET',
    RENEW = 'RENEW'
};
interface Input {
    fsym: string;
    tsym: string;
}
interface ApiRequestInput extends Input {
    histo: HistoType;
}

export const externalDispatchers = {
    REQUEST_INITIAL_DATA: (req: ApiRequestInput) => createAction(actionTypes.REQUEST_INITIAL_DATA, req),
    LISTEN_CURRENT: (payload: Input) => createAction(actionTypes.LISTEN_CURRENT, payload),
    UNSUBSCRIBE: () => createAction(actionTypes.UNSUBSCRIBE),
    UPDATE_DATA: (req: ApiRequestInput) => createAction(actionTypes.UPDATE_DATA,req),
    CLEAR:() =>  createAction(actionTypes.CLEAR),
    RESET:() => createAction(actionTypes.RESET),
    RENEW:(req: ApiRequestInput) => createAction(actionTypes.RENEW,req)
}
const dispatchers = {
    CATCH_ERROR: (e: Error) => createAction(actionTypes.CATCH_ERROR, e.message),
    REQUEST_SUCCESS: (payload: MappedHistoData) => createAction(actionTypes.REQUEST_SUCCESS, payload),
    SUBSCRIPTION_TO_STATE: (payload: CurrencyLiveData) => createAction(actionTypes.SUBSCRIPTION_TO_STATE, payload),
    PARTIAL_CLEAR: () => createAction(actionTypes.PARTIAL_CLEAR),
    ...externalDispatchers
};

// type definitions for all actions.
export type Actions = ActionsUnion<typeof dispatchers>;


//// Epic for listening current price via websocket.

const SubscribeSingleCurrentEpic: Epic<Actions> = (action$: ActionsObservable<Actions>) => action$.pipe(
    ofType<Actions, ActionWithPayload<actionTypes.LISTEN_CURRENT, Input>, actionTypes.LISTEN_CURRENT>(actionTypes.LISTEN_CURRENT),
    switchMap(ac =>{
        const interactor = CryptoApiInterActors.getCryptoSubscription()
        return interactor.subscribe(ac.payload).pipe(
            map(sub => dispatchers.SUBSCRIPTION_TO_STATE(new CurrencyLiveData(sub))),
            takeUntil(action$.pipe(
                ofType<Actions, Action<actionTypes.UNSUBSCRIBE>, actionTypes.UNSUBSCRIBE>(actionTypes.UNSUBSCRIBE),
                tap(() => interactor.unsubscribe()),
            )),
            catchError(e => of(dispatchers.CATCH_ERROR(e))),
        )
    })
);
/*
map((data: CoinHistoDataResp) => ({ ...data, Data: mappingDate(data.Data), time: d.payload.time})),
            map(data => dispatchers.REQUEST_SUCCESS({ data, time: d.payload.tsym }))

 */

const DataEpic: Epic<Actions> = (action$: ActionsObservable<Actions>)=> action$.pipe(
    ofType<Actions, ActionWithPayload<actionTypes.REQUEST_INITIAL_DATA, ApiRequestInput>, actionTypes.REQUEST_INITIAL_DATA>(actionTypes.REQUEST_INITIAL_DATA),
    switchMap(action =>from(CryptoApiInterActors.getHistoData().requestWithMapping(action.payload)).pipe(
            map((data: MappedHistoData) => dispatchers.REQUEST_SUCCESS(data)),
            startWith(dispatchers.LISTEN_CURRENT(action.payload)),
            catchError(e => of(dispatchers.CATCH_ERROR(e))),
        )
    ),
);
const UpdateDataEpic: Epic<Actions> = (action$: ActionsObservable<Actions>)=> action$.pipe(
    ofType<Actions, ActionWithPayload<actionTypes.UPDATE_DATA,ApiRequestInput>, actionTypes.UPDATE_DATA>(actionTypes.UPDATE_DATA),
    switchMap( action => from(CryptoApiInterActors.getHistoData().requestWithMapping(action.payload)).pipe(
            map((data: MappedHistoData) => dispatchers.REQUEST_SUCCESS(data)),
            startWith(dispatchers.PARTIAL_CLEAR()),
            catchError(e => of(dispatchers.CATCH_ERROR(e))),
        )
    )
);
const RenewEpic: Epic<Actions> = (action$: ActionsObservable<Actions>)=> action$.pipe(
    ofType<Actions, ActionWithPayload<actionTypes.RENEW, ApiRequestInput>, actionTypes.RENEW>(actionTypes.RENEW),
    switchMap(action => from(CryptoApiInterActors.getHistoData().requestWithMapping(action.payload)).pipe(
            map((data: MappedHistoData) => dispatchers.REQUEST_SUCCESS(data)),
            startWith(dispatchers.RESET()),
            catchError(e => of(dispatchers.CATCH_ERROR(e))),
        ))
);
const ResetEpic: Epic<Actions> = (action$: ActionsObservable<Actions>)=> action$.pipe(
    ofType<Actions, Action<actionTypes.RESET>, actionTypes.RESET>(actionTypes.RESET),
    switchMap( () =>
         of([1]).pipe(
            map(() => dispatchers.CLEAR()),
            startWith(dispatchers.UNSUBSCRIBE())
        )
    )

);
export const epics = [ DataEpic, SubscribeSingleCurrentEpic, UpdateDataEpic,ResetEpic, RenewEpic ];
