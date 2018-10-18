import  * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { hydrate } from 'react-dom';
import { ClientSideStore } from '../containers';
import App from '../containers/App';

const store = ClientSideStore(window.__initialData__);
delete window.__initialData__;

hydrate(
    <Provider
        store={store}
    >
        <Router>
            <App />
        </Router>
    </Provider>
    ,document.getElementById('app'),
    () => console.log('hydrate!')
);

