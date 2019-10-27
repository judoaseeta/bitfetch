import {Reducer} from "redux";
import { AccountReducer, initialState } from './accountState';
import { actionTypes, Actions } from './accountEpic';
export const reducer: Reducer<AccountReducer, Actions> = (state = initialState, action) => {
    if(action.type === actionTypes.REQUEST_TRANSACTIONS_SUCCESS) {
        return {
            tradeStatus: action.payload.status,
            transactions: state.transactions.concat(action.payload.transactions),
        }
    }
    return state;
};

