import {Reducer} from "redux";
import { ActionTypes,  Actions } from './coinListEpic';
import { CoinListReducer, initialState } from './coinListState';

export const reducer: Reducer<CoinListReducer, Actions> = (state = initialState, action) => {
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
