import * as React from 'react';
import { Request } from 'express';
import { StaticRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from '../containers/App';
import {Store} from "redux";

/*      @ store : Redux store object
        @ req: express http Request object
        @ context: Static Router context object/ default = {}
*/
export default (store: Store, req: Request, context: any) => (
    <Provider
        store={store}
    >
        <Router
            context={context}
            location={req.url}
        >
            <App />
        </Router>
    </Provider>
);