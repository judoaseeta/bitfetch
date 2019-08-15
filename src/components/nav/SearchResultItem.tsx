import * as React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

import * as styles from './styles/SearchResultItem.scss';
const SearchResultItem: React.FunctionComponent<{
    CoinName: string;
    Symbol: string;
} & RouteComponentProps> = ({CoinName, Symbol, }) => (
    <li
        className={styles.container}
        id={Symbol}
    >
            <Link
                className={styles.link}
                to={{
                    pathname: `/currencies/${Symbol}`,
                    search: '?histo=live'
                }}
            >{CoinName}:{Symbol}</Link>
    </li>
);

export default withRouter(SearchResultItem);