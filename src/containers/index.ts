import { applyMiddleware, combineReducers, compose, createStore  } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { epics as MainEpics, reducer as MainReducer } from './App';
import { epics as AreaEpics, reducer as AreaReducer } from './AreaChart';//
import { epics as CryptoEpics,  reducer as CryptoReducer } from './CryptoChart';
const rootEpics = combineEpics(
    ...AreaEpics,
    ...CryptoEpics,
    ...MainEpics,
);

const rootReducer = combineReducers({
    area: AreaReducer,
    chart: CryptoReducer,
    main : MainReducer,
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
    EpicMiddleWare.run(rootEpics);
    return store;
};


