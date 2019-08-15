import { epics as MainEpics, reducer as MainReducer } from './App';
import { epics as CryptoEpics,  reducer as CryptoReducer } from './CryptoChart';
import { combineReducers } from 'redux';
const rootReducer = combineReducers({
    chart: CryptoReducer,
    main : MainReducer,
});

export default rootReducer;