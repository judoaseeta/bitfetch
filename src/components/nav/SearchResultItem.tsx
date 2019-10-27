import * as React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

import HighLightedString from '../../utils/component/highlightedSpan';
import * as styles from './styles/SearchResultItem.scss';
const SearchResultItem: React.FunctionComponent<{
    filteredKeyword: string;
    coinName: string;
    symbol: string;
} & RouteComponentProps> = ({coinName, filteredKeyword, symbol, }) => {
    return <li
        className={styles.container}
        id={symbol}
    >
        <Link
            className={styles.link}
            to={{
                pathname: `/currencies/${symbol}`,
                search: '?histo=LIVE'
            }}
        >
        <HighLightedString highlightedString={filteredKeyword} targetString={coinName} highlightClassName={styles.highlighted} />
        :<HighLightedString highlightedString={filteredKeyword} targetString={symbol} highlightClassName={styles.highlighted} />
        </Link>
    </li>
};

export default withRouter(SearchResultItem);