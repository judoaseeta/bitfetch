import * as React from 'react';

import LazyImage from '../../utils/component/LazyImage';
import ToolTip from '../../utils/component/ToolTip';
import * as styles  from './styles/HeaderImage.scss';
import * as previewImage from '../../files/coin_preview.png';

//entity
import CoinListData from '../../core/lib/entities/coinListData';

const HeaderImage: React.FunctionComponent<{
    data: CoinListData
    src: string;
}> = ({ data, src }) => (
    <ToolTip
        toolTipFrom={'down'}
        toolTipTo={'left'}
        tooltipContent={
            <div
                style={{
                    backgroundColor: 'black',
                    padding: '0.2em',
                    width: '400px',
                }}
            >
                <h4>{data.fullName}</h4>
                <p>{data.totalCoinSupply}</p>
                <p>{data.algorithm}</p>
            </div>
        }
    >
        <LazyImage
            className={styles.img}
            previewSrc={previewImage}
            src={src}
        />
    </ToolTip>
);

export default HeaderImage;
