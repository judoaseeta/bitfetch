import * as React from 'react';
import * as styles from './styles/SymbolSearch.scss';
import SearchInput from './SearchInput';
import SearchResult from './SearchResult';


const SymbolSearch: React.FunctionComponent<{
    filteredCoinList: CoinListItem[];
    filterKeyword: string;
    loaded: boolean;
    searching: boolean;
    setFilterKeyword: React.ChangeEventHandler<HTMLInputElement>;
    setSearching: React.FocusEventHandler<HTMLInputElement>;
}> = ({ filteredCoinList,filterKeyword , loaded, searching,setFilterKeyword, setSearching}) => (
    <form
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
            filterKeyword={filterKeyword}
            searching={searching}
        />
    </form>
);

export default SymbolSearch;