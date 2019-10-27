import CoinListData from '../../entities/coinListData';

export interface CoinListReducer  {
    coinList: null | Map<string, CoinListData>;
    loaded: boolean;
}
export const initialState = {
    coinList: null,
    loaded: false,
};