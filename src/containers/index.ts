import { applyMiddleware, combineReducers, compose, createStore  } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
// authentication adapters
import { epics as AuthEpics } from '../core/lib/adapters/redux/authEpics';
import { reducer as AuthReducer } from '../core/lib/adapters/redux/authReducer';
// mainChartData adapters
import { epics as CryptoEpics} from '../core/lib/adapters/redux/mainChartDataEpics';
import { reducer as CryptoReducer } from '../core/lib/adapters/redux/mainChartDataReducer';
// coinList adapters
import { epics as CoinListEpics } from '../core/lib/adapters/redux/coinListEpic';
import { reducer as CoinListReducer } from '../core/lib/adapters/redux/coinListReducer';
// account adapters
import { epics as AccountEpics} from '../core/lib/adapters/redux/accountEpic';
import { reducer as AccountReducer } from '../core/lib/adapters/redux/accountReducer';

const rootEpics = combineEpics(
    ...AuthEpics,
    ...CryptoEpics,
    ...CoinListEpics,
    ...AccountEpics
);

const rootReducer = combineReducers({
    account: AccountReducer,
    auth: AuthReducer,
    chart: CryptoReducer,
    coinList : CoinListReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export const ServerSideStore = () => {
    const EpicMiddleWare = createEpicMiddleware(
   );
    const store = createStore(
        rootReducer,
        applyMiddleware(EpicMiddleWare),
    );
    EpicMiddleWare.run(rootEpics);

    return store;
};

export const ClientSideStore = (preloadedState: any) => {
    const EpicMiddleWare = createEpicMiddleware({
        dependencies :{
            fetch,
        }
    });
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
        rootReducer,
        preloadedState,
        composeEnhancers(
            applyMiddleware(EpicMiddleWare),
        )
    );
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./rootReducer',() => {
            const nextRootReducer = require('./rootReducer');
            store.replaceReducer(nextRootReducer);
        });
    }
    EpicMiddleWare.run(rootEpics);
    return store;
};


