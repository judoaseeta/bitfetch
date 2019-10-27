import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter ,RouteComponentProps} from 'react-router-dom';
import { RootState } from '../../containers';

import HeaderImage from './HeaderImage';
import Trade from '../../containers/TradeCurrency';
import TradeCurrency from '../tradeCurrency';
import * as styles from './styles/Header.scss';
//entity
import CoinListData from '../../core/lib/entities/coinListData';


const mapStateToProps = (state: RootState) => ({
    loaded: state.coinList.loaded,
    coinList: state.coinList.coinList
});
type HeaderTypes = ReturnType<typeof mapStateToProps> & RouteComponentProps<{
    fsym: string
}>;
const Header: React.FunctionComponent<HeaderTypes> = ({ coinList, loaded, match: { params : { fsym }} }) => {
    let currData: CoinListData | null = null;
    const container = styles.container;
    if(loaded && coinList) {
        currData = coinList.get(fsym)!;
    }
    if(currData) {
        return <header className={container}>
            <div
                className={styles.headerLeft}
            >
                <HeaderImage
                    data={currData}
                    src={`http://www.cryptocompare.com${currData.imageUrl}`}
                />
                <h4>{fsym} - {currData.fullName}</h4>
            </div>
            <div></div>
            <div
                className={styles.headerRight}
            >
                <Trade>{(rProps) => <TradeCurrency {...rProps} />}</Trade>
                <h5>Source: cryptocompare.com </h5>
            </div>

        </header>
    }
    return <header className={container}>{fsym}</header>
};

export default withRouter(connect(mapStateToProps)(Header));