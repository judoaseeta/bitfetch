import * as React from 'react';

import * as styles from './styles/AssetTable.scss';

//entity
import { TradeStatusProp } from '../../core/lib/entities/tradeStatus';
const AssetTable:React.FunctionComponent<{
    statusProp: TradeStatusProp;
}> = ({ statusProp }) =>
    <table
        className={styles.table}
    >
        <thead>
            <tr>
                <th>quantities</th>
                <th>total</th>
                <th>avr.price</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{statusProp.quantity}</td>
                <td>{statusProp.amount}</td>
                <td>{statusProp.averagePrice}</td>
            </tr>
        </tbody>
    </table>;

export default AssetTable;
