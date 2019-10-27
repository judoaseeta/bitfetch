import {ActionsUnion, createAction} from "../../../../utils/redux/createAction";
import {ActionsObservable, Epic, ofType} from "redux-observable";
import {map, mergeMap, tap} from "rxjs/operators";
import {from} from "rxjs";
// adapters
import TransactionInterActor from '../../useCases/awsApi/transactionsInteractor';
// services
import AwsApi from '../../services/awsApi';
// entity
import Transaction, { RawTransactionData } from '../../entities/transaction';
import TradeStatus from '../../entities/tradeStatus';

export enum actionTypes {
    REQUEST_TRANSACTIONS = "REQUEST_TRANSACTIONS",
    REQUEST_TRANSACTIONS_SUCCESS = "REQUEST_TRANSACTIONS_SUCCESS",
    REQUEST_TRANSACTIONS_FAIL = "REQUEST_TRANSACTIONS_FAIL"
}

export const presenterActions = {
    REQUEST_TRANSACTIONS: () => createAction(actionTypes.REQUEST_TRANSACTIONS),
};
const dispatchers = {
    ...presenterActions,
    REQUEST_TRANSACTIONS_SUCCESS: (transactions: Transaction[] , status: TradeStatus) =>
        createAction(actionTypes.REQUEST_TRANSACTIONS_SUCCESS,{ transactions, status} )
};

export type Actions = ActionsUnion<typeof dispatchers>;


const mapper = (rawData: RawTransactionData[]) => rawData.map( d => new Transaction(d));
const RequestTransactionsEpic: Epic<Actions> = (action$: ActionsObservable<Actions>) => action$.pipe(
    ofType<Actions>(actionTypes.REQUEST_TRANSACTIONS),
    mergeMap(() => {
        const interactor = new TransactionInterActor(new AwsApi());
        return from(interactor.request({
            method: 'get',
            endpointName: 'transaction',
            path: '/query'
        })).pipe(
            map( rawData => mapper(rawData.Items)),
            map( d => {
                const status =  new TradeStatus(d);
                return dispatchers.REQUEST_TRANSACTIONS_SUCCESS(d,status)
            })
        )
    })
);

export const epics = [RequestTransactionsEpic];
