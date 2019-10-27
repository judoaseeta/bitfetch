import {ActionsUnion, createAction} from "../../../../utils/redux/createAction";
import {ActionsObservable, Epic, ofType} from "redux-observable";
import {map, mergeMap, tap} from "rxjs/operators";
import {from} from "rxjs";

// entity
import CoinListData from '../../entities/coinListData';

// useCases
import InterActors from '../../useCases/cryptoApi';

export enum ActionTypes {
    REQUEST_COIN_LIST = 'REQUEST_COIN_LIST',
    COIN_LIST_TO_STATE = 'COIN_LIST_TO_STATE',
}

export const externalDispathcers = {
    REQUEST_COIN_LIST: () => createAction(ActionTypes.REQUEST_COIN_LIST),
}
const dispatchers = {
   ...externalDispathcers,
    COIN_LIST_TO_STATE: (payload: Map<string, CoinListData>) => createAction(ActionTypes.COIN_LIST_TO_STATE, payload),
};
export type Actions = ActionsUnion<typeof dispatchers>;

const CoinListEpic: Epic<Actions> = (action$: ActionsObservable<Actions>) => action$.pipe(
    ofType(ActionTypes.REQUEST_COIN_LIST),
    mergeMap(() => {
            return from( InterActors.getCoinList().requestWithMapping({})).pipe(
                tap(d => console.log(d)),
                map(data => dispatchers.COIN_LIST_TO_STATE(data)),
            )
        }
    )
);

export const epics = [CoinListEpic];