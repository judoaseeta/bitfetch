import {HistoData} from '../../entities/histoData';
import Flag from '../../entities/flag';

export interface MainChartDataState {
    data: HistoData[],
    currentPrice: {
        current: number,
        flag: Flag
    },
    listening: boolean,
    isDisconnected: boolean,
}
export const initialState: MainChartDataState = {
    data: [],
    currentPrice : {
        current: 0,
        flag: Flag.INITIAL,
    },
    listening: false,
    isDisconnected: false
};