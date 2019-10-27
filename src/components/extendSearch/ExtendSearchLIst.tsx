import * as React from 'react';
import ListItem from "./ExtendSearchListItem";

import * as styles from './styles/ExtendSearchList.scss';

// entity
import CoinListData from '../../core/lib/entities/coinListData';

const SliceCoinList = (coinList: CoinListData[], itemNum: number,pageNum: string) =>  {
    const lastItemNum: number = Number(pageNum) * itemNum;
    return coinList.slice(lastItemNum - itemNum, lastItemNum);
};

const ExtendSearchList: React.FunctionComponent<{
    filteredCoinList: CoinListData[];
    itemNum: number;
    pageNum: string;
}> = ({ filteredCoinList, itemNum, pageNum }) => (
    <ul
        className={styles.list}
    >
        {SliceCoinList(filteredCoinList, itemNum,pageNum).map( coin =>
            <ListItem key={coin.symbol} symbol={coin.symbol} fullname={coin.fullName} imageUrl={coin.imageUrl}/>
        )}
    </ul>
);

export default ExtendSearchList;