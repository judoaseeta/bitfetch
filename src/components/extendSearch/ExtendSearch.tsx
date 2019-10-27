import * as React from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { parse } from 'query-string';

import { RootState } from '../../containers';
import List from './ExtendSearchLIst';
import PageIndicator from './PageIndicator';
//entity
import CoinListData from '../../core/lib/entities/coinListData';

import * as styles  from './styles/ExtendSearch.scss';
// constant for items length per page;
export const itemNum = 20;

const ExtendSearch: React.FunctionComponent<{
    filteredCoinList: CoinListData[];
} & RouteComponentProps<{
    fsym: string;
}>> = ({ filteredCoinList, match:{ params : { fsym }}, location: { search } }) => {
    if(filteredCoinList.length === 0) {
        return <p>wating...</p>
    } else if (!parse(search).page) {
        return <Redirect to={'/'} />
    }else {
        return (
            <div
                className={styles.container}
            >
                    keyword '{fsym}' has {filteredCoinList.length} items.
                <List
                    filteredCoinList={filteredCoinList}
                    itemNum={itemNum}
                    pageNum={parse(search).page as string}
                />
                <PageIndicator
                    listLength={filteredCoinList.length}
                    currentPage={Number(parse(search).page as string)}
                    itemNum={itemNum}
                />
            </div>
        );
    }
}
export default withRouter(ExtendSearch);

