import * as React from 'react';

import Icon, {ExtendSearchIconType} from './ExtendSearchItemIcon';
import ItemImage from './ExtendSearchItemImage';
import * as styles from './styles/ExtendSearchListItem.scss';

const ExtendSearchListItem: React.FunctionComponent<{
    symbol: string;
    fullname: string;
    imageUrl: string;
}> = ({ fullname, imageUrl, symbol}) => (
    <li
        className={styles.listItem}
    >
        <div
            className={styles.coinNameHolder}
        >{fullname}
        </div>
        <div
            className={styles.iconHolder}
        >
            <Icon
                iconType={ExtendSearchIconType.lineChart}
            />
            <Icon
                iconType={ExtendSearchIconType.pieChart}
            />
        </div>
        <div
            className={styles.imageHolder}
        >
            <ItemImage
                alt={`image of ${symbol}`}
                className={styles.listItemImage}
                src={`http://www.cryptocompare.com${imageUrl}`}
            />
        </div>
    </li>
);

export default ExtendSearchListItem;

