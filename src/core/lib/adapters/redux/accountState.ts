//entity
import Transaction from '../../entities/transaction';
import TradeStatus from '../../entities/tradeStatus';
export interface AccountReducer {
    transactions: Transaction[];
    tradeStatus: TradeStatus | null;
};
export const initialState: AccountReducer = {
    transactions: [],
    tradeStatus: null,
};

