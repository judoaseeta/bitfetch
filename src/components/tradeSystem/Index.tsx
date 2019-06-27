import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import * as styles from './index.scss';

import Header from './Header';
import AreaChart from '../../containers/AreaChart';
import CryptoChart  from '../../containers/CryptoChart';
import Chart from '../chart/Chart';
import Tester from './Tester';
import Helmet from '../../utils/HelmetCompo';
const TradeSystem: React.FunctionComponent<{

} & RouteComponentProps<{ fsym: string }>> = ({ match: { params: { fsym } } }) => (
    <div
        className={styles.container}
    >
        <Header
            fsym={fsym}
        />
        <Helmet
            title={`Virtual trading ${fsym} with Bitfetch`}
            metas={[
                {
                    name: 'keywords',
                    content:`${fsym}, virtual, trading, crypto-currency, crypto currencies,bitcoin, live candle chart, historic price`
                }
            ]}
        />
        <main>

            <div><AreaChart width={200} height={50}>{() => <div>12</div>}</AreaChart></div>
            <CryptoChart
                width={700}
                height={400}
            >
                {(props) => (<Chart
                        {...props}
                />)
                }
            </CryptoChart>
        </main>
        <Tester />
    </div>
);

export default withRouter(TradeSystem);
