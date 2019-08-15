import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import * as styles from './index.scss';

import Header from './Header';
import AreaChart from '../../containers/AreaChart';
import CryptoChart  from '../../containers/CryptoChart';
import Chart from '../chart/Chart';
import AreaChartCompo from '../areaChart/';
import Tester from './Tester';
import Helmet from '../../utils/HelmetCompo';
const TradeSystem: React.FunctionComponent<{

} & RouteComponentProps<{ fsym: string }>> = ({ match: { params: { fsym } } }) => (
    <div
        className={styles.container}
    >
        <Header />
        <Helmet
            title={`Virtual trading ${fsym} with Bitfetch`}
            metas={[
                {
                    name: 'keywords',
                    content:`${fsym}, virtual, trading, crypto-currency, crypto currencies, bitcoin, live candle chart, historical price`
                }
            ]}
        />
        <main>
            <AreaChart width={200} height={50}>{(props) => <AreaChartCompo {...props}/>}</AreaChart>
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
