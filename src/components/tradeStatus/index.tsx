import * as React from 'react';
import { RenderProps } from '../../containers/InvestStatus';
import Ticker from './ticker';
import Loading from '../../utils/puffLoader/Loading';
import * as styles  from './styles/index.scss';

const TradeStatusCompo: React.FunctionComponent<RenderProps> = ({ fsym, isSignIn ,currentStatus: { current, listening }, tradeStatus}) => (
    <div
        className={styles.container}
    >
        <div
            className={styles.header}
        >
            <h5>TradeStatus of {fsym}</h5>
        </div>
        <Loading
            strokeWidth={25}
            isLoading={!tradeStatus}
            strokeColor={'#f0932b'}
        />
        {
            // check if tradeStatus is fetched and there is a trade record of current fsym(currency)
            tradeStatus
            && tradeStatus.get(fsym)
            && current
            && <Ticker
                avrPrice={tradeStatus.get(fsym).averagePrice}
                current={current}
                isUp={tradeStatus.get(fsym).averagePrice < current}
            />
        }
        {
            tradeStatus && isSignIn && !tradeStatus.get(fsym) &&
            <div>you don't have a position in this currency</div>
        }
        {
            !tradeStatus && !isSignIn &&
                <div>You should Sign in to see your invest status for {fsym} </div>
        }

    </div>
);
export default TradeStatusCompo;