import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import * as styles from './index.scss';

import Header from './Header';
import Analysis from '../../containers/Analysis';
import AreaChart from '../../containers/subCharts/SubCharts';
import CryptoChart  from '../../containers/CryptoChart';
import InvestStatus from '../../containers/InvestStatus';
import TradingPairs from '../../containers/TradingPairs';
import Chart from '../chart/Chart';
import AreaChartCompo from '../areaChart/';
import AnalCompo from '../analysis/';
import TradeStatusCompo from '../tradeStatus';
import Tester from './Tester';
import Helmet from '../../utils/component/HelmetCompo';
const TradeSystem: React.FunctionComponent<{

} & RouteComponentProps<{ fsym: string }>> = ({ match: { params: { fsym } } }) => (
    <div
        className={styles.container}
    >
        <Helmet
            title={`Virtual trading ${fsym} with Bitfetch`}
            metas={[
                {
                    name: 'keywords',
                    content:`${fsym}, virtual, trading, crypto-currency, crypto currencies, bitcoin, live candle chart, historical price`
                }
            ]}
        />
        <Header />
        <main>
            <AreaChart width={200} height={50}>{(props) => <AreaChartCompo {...props}/>}</AreaChart>
            <CryptoChart
                width={700}
                height={400}
            >
                {(props) => (<Chart {...props} />)}
            </CryptoChart>
        </main>
        <div
            className={styles.status}
        >
            <InvestStatus>{props => <TradeStatusCompo {...props} />}</InvestStatus>
            <TradingPairs />
        </div>
        <footer>
            <Analysis>{rProps => <AnalCompo {...rProps} /> }</Analysis>
        </footer>
    </div>
);

export default withRouter(TradeSystem);
