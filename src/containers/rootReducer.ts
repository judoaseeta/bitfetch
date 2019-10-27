
import { reducer as CryptoReducer } from '../core/lib/adapters/redux/mainChartDataReducer';
import { reducer as CoinListReducer } from '../core/lib/adapters/redux/coinListReducer';
import { reducer as AuthReducer} from "../core/lib/adapters/redux/authReducer";
import { reducer as AccountReducer} from '../core/lib/adapters/redux/accountReducer';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    account: AccountReducer,
    auth: AuthReducer,
    chart: CryptoReducer,
    coinList : CoinListReducer,
});
export default rootReducer;