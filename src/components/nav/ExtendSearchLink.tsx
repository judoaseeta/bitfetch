import * as React from 'react';
import { Link } from 'react-router-dom';

import * as styles from './styles/ExtendSearchLink.scss';


const ExtendSearchLink: React.FunctionComponent<{
    filterKeyword: string;
    searchResultLength: number;
}> = ({ filterKeyword, searchResultLength }) => (
    <li
        className={styles.container}
    >
        <Link
            className={styles.link}
            to={{
                pathname: `/search/${filterKeyword.toUpperCase()}`,
                search:'?page=1'
            }}
        >&nbsp; ...{searchResultLength - 10} More Items</Link>
    </li>
);

export default ExtendSearchLink;
