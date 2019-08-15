import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter ,RouteComponentProps} from 'react-router-dom';
import { RootState } from '../../containers';

import HeaderImage from './HeaderImage';
import * as styles from './styles/Header.scss';

const mapStateToProps = (state: RootState) => ({
    loaded: state.main.loaded,
    coinList: state.main.coinList
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
            <HeaderImage
                src={`http://www.cryptocompare.com${currData.ImageUrl}`}
            />
            <>{fsym} - {currData.FullName}</>
        </header>
    }
    return <header className={container}>{fsym}</header>
};

export default withRouter(connect(mapStateToProps)(Header));