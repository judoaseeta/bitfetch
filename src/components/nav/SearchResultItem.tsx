import * as React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

import * as styles from './styles/SearchResultItem.scss';
const SearchResultItem: React.SFC<{
    CoinName: string;
    Symbol: string;
} & RouteComponentProps> = ({CoinName, Symbol, }) => (
    <li
        className={styles.container}
    >
        <span>
            <Link
                className={styles.link}
                to={{
                    pathname: `/currencies/${Symbol}`,
                    search: '?histo=live'
                }}
            >{CoinName}:{Symbol}</Link>
        </span>
    </li>
);

export default withRouter(SearchResultItem);