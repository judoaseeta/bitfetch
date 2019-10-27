import {Reducer} from "redux";
import {Actions, actionTypes} from './mainChartDataEpics';
import {initialState, MainChartDataState} from './mainChartDataState';
import {HistoData} from '../../entities/histoData';

export const mapDataWithCurrent = (data: HistoData[], price: number) => {
    let lastData = data[data.length - 1];
    if(lastData.high < price){
        lastData.high = price;
    } else if (lastData.low > price) {
        lastData.low = price;
    }
    lastData.close = price;
    return [...data.slice(0, data.length - 1), lastData ];
};
export const reducer: Reducer<MainChartDataState, Actions> = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.REQUEST_SUCCESS:
            return {
                ...state,
                data: action.payload.Data,
            };
        case actionTypes.SUBSCRIPTION_TO_STATE:
            return {
                ...state,
                data: state.data.length > 1? mapDataWithCurrent(state.data, action.payload.price || state.currentPrice.current ) : state.data,
                currentPrice: {
                    current: action.payload.price ? action.payload.price : state.currentPrice.current,
                    flag: action.payload.flag,
                },
                listening: true,
                isDisconnected: false
            };
        case actionTypes.CLEAR:
            return {
                ...state,
                data: [],
                currentPrice: {
                    current: 0,
                    flag: -1
                },
                listening: false,
                isDisconnected: false,
            };
        case actionTypes.CATCH_ERROR:
            if(action.payload === 'disconnected') {
                if(!state.listening) {
                    return state;
                }
                return {
                    ...state,
                    isDisconnected: true
                };
            }
            return state;
        case actionTypes.PARTIAL_CLEAR:
            return {
                ...state,
                data: [],
            };
        default: return state;
    }
};