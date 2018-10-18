import * as React from 'react';
import * as styles from './styles/SymbolSearch.scss';
import SearchInput from './SearchInput';
import SearchResult from './SearchResult';
const SymbolSearch: React.SFC<{
    filteredCoinList: CoinListItem[];
    filterKeyword: string;
    loaded: boolean;
    searching: boolean;
    setFilterKeyword: React.ChangeEventHandler<HTMLInputElement>;
    setSearching: React.FocusEventHandler<HTMLInputElement>;
}> = ({ filteredCoinList,filterKeyword , loaded, searching,setFilterKeyword, setSearching, }) => (
    <div
        className={styles.container}
    >
        <SearchInput
            filterKeyword={filterKeyword}
            setFilterKeyword={setFilterKeyword}
            setSearching={setSearching}
            loaded={loaded}
        />
        <SearchResult
            filteredCoinList={filteredCoinList}
            searching={searching}
        />
    </div>
);

export default SymbolSearch;