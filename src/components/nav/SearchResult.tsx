import * as React from 'react';
import SearchResultItem from './SearchResultItem';
import * as styles from './styles/SearchResult.scss';
import { bind } from 'classnames/bind';

const cx = bind(styles);
const SearchResult: React.SFC<{
    filteredCoinList: CoinListItem[];
    searching: boolean;
}>= ({filteredCoinList, searching, }) => (
    <ul
        className={cx('container', {
            on: searching && filteredCoinList && filteredCoinList.length > 0
        })}
    >
        {
            searching && filteredCoinList && filteredCoinList.slice(0, 10).map((item) =>
                <SearchResultItem
                    key={item.Id}
                    CoinName={item.CoinName}
                    Symbol={item.Symbol}
                />
            )
        }
    </ul>
);

export default SearchResult;
