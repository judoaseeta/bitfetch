import * as React from 'react';
import * as styles from './styles/SearchInput.scss';
const SearchInput: React.SFC<{
    setFilterKeyword: React.ChangeEventHandler<HTMLInputElement>;
    setSearching: React.FocusEventHandler<HTMLInputElement>;
    filterKeyword: string;
    loaded: boolean;
}> = ({ setFilterKeyword, setSearching, filterKeyword, loaded, }) => (
        <input
            className={styles.input}
            disabled={!loaded}
            onBlur={setSearching}
            onChange={setFilterKeyword}
            onFocus={setSearching}
            value={filterKeyword}
            placeholder={loaded ? 'Enter Symbol' : ''}
        />
);
export default SearchInput;