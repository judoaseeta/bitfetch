import * as React from 'react';
import SearchResultItem from './SearchResultItem';
import ExtendSearchLink from './ExtendSearchLink';
import * as styles from './styles/SearchResult.scss';
import { bind } from 'classnames/bind';

const cx = bind(styles);
const SearchResult: React.FunctionComponent<{
    filteredCoinList: CoinListItem[];
    filterKeyword: string;
    searching: boolean;
}>= ({filteredCoinList, filterKeyword, searching, }) => (
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
        {
            filteredCoinList && filteredCoinList.length > 10 &&
                <ExtendSearchLink
                    filterKeyword={filterKeyword}
                    searchResultLength={filteredCoinList.length}
                />
        }
    </ul>
);

export default SearchResult;
