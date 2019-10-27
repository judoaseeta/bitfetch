import * as React from 'react';
import CoinListItem from './CoinListItem';
import * as styles from './styles/CoinList.scss';
const CoinList: React.FunctionComponent<{}> = () =>
<ul
    className={styles.list}
>
    {Array.from({ length: 14}).map( (val, i) =>
            <CoinListItem />
        )}
</ul>;

export default CoinList;