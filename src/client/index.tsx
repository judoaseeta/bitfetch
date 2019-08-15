import  * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { hydrate } from 'react-dom';
import Auth from '@aws-amplify/auth';;
import { ClientSideStore } from '../containers';
import App from '../containers/App';
import { AppContainer } from "react-hot-loader"

const store = ClientSideStore(window.__initialData__);
delete window.__initialData__;
Auth.configure(window.__authConfig__);
delete window.__authConfig__;
function render(Component: React.ComponentType<any>) {
    hydrate(
        <Provider
            store={store}
        >
            <Router>
                <Component />
            </Router>
        </Provider>
        ,document.getElementById('app'),
        () => console.log('hydrated')
    );
}
render(App);
if(module.hot) {
    module.hot.accept();
}