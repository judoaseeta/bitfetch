import  * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { hydrate } from 'react-dom';
import Auth from '@aws-amplify/auth';;
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ClientSideStore } from '../containers';
import App from '../containers/App';
library.add(fab, fas);
const store = ClientSideStore(window.__initialData__);
delete window.__initialData__;
Auth.configure(window.__authConfig__);


delete window.__authConfig__;
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

