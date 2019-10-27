import * as React from 'react';
import {Route, RouteComponentProps, Switch, withRouter} from 'react-router-dom';


import {connect} from 'react-redux';
import * as styles from './styles/App.scss';
// dumb components

import Helmet from '../utils/component/HelmetCompo';
import AuthForm from './authentication/AuthForm';
import Confirm from './authentication/Confirm';
import ExtendSearch from './ExtendSearch';
import Header from './Nav';
import TestCompo from './TestCompo';
import MainCanvas from './MainCanvas';
import { RootState } from './';


import Account from '../components/account';
import TradeSystem from '../components/tradeSystem/';
import MainCanvasCompo from '../components/MainCanvas/';

//utilities
import TriggeredRoute from "../utils/component/TriggeredRoute";
import signedAPI from '../utils/apiUtils/signedApi';


const MapStateToProps = (state: RootState) => ({
    auth: state.auth,
});

export class App extends React.Component<Props, {}> {
    async initAccount() {
        try {
            const item = await signedAPI({
                method: 'get',
                endpointName: 'account',
                path: '/load'
            });
            if(item.status === false && item.message === 'Item not found') {
                await signedAPI({
                    method: 'post',
                    endpointName: 'account',
                    path: '/create',
                    body: {}
                });
            }
        } catch(e) {
            throw e;
        }
    }
    async componentDidMount() {
        if(this.props.auth.isSignIn) {
           //  await this.initAccount();
        }
    }
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.log(error, errorInfo);
    }

    render() {
        return (
            <div
                className={styles.container}
            >
                <Helmet
                    title="Bitfetch: The best platform for CryptoCurrency"
                    metas={[
                        {
                            name: 'description',
                            content: 'Bitfetch - virtual trading, live chart for crypto currencies',
                        },
                        {
                            name: 'author',
                            content: 'Bitcoin, CryptoCurrencies, Ethereum',
                        },
                    ]}
                />
                <Header />
                <main
                    className={styles.innerContainer}
                >
                    <Switch>
                        <Route
                            path="/"
                            exact
                            component={() => <MainCanvas>{(props, ref) => <MainCanvasCompo {...props} ref={ref}/>}</MainCanvas>}
                        />
                        <TriggeredRoute
                            path='/triggered'
                            component={TestCompo}
                        />
                        <Route
                            path="/market"
                            render={() => <div>

                            </div>}
                        />
                        <Route
                            path="/currencies/:fsym"
                            component={TradeSystem}
                        />
                        <Route
                            path="/search/:fsym"
                            component={ExtendSearch}
                        />
                        <Route
                            path='/test'
                            render={() =>
                                <div>test</div>
                            }
                        />
                        <TriggeredRoute
                            path='/account'
                            component={Account}
                        />
                        <TriggeredRoute
                            isAuthNeeded={false}
                            path='/auth/:authType'
                            component={AuthForm}
                        />
                        <TriggeredRoute
                            isAuthNeeded={false}
                            path='/confirm/:username'
                            component={Confirm}
                        />
                    </Switch>
                </main>
            </div>
        )
    }
}

export type Props = ReturnType<typeof MapStateToProps>
    & RouteComponentProps;
export default withRouter(connect(MapStateToProps)(App));

