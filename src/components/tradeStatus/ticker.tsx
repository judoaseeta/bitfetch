import * as React from 'react';
import { bind } from 'classnames/bind';
import * as styles from './styles/ticker.scss';
const cx = bind(styles);
const Ticker: React.FunctionComponent<{
    isUp: boolean;
    current: number;
    avrPrice: number;
}> = ({ avrPrice, current, isUp }) => {
    const priceGap = current - avrPrice;
    const profitage =  (priceGap / avrPrice) * 100;
    const indicator = () => {
        if(priceGap > 0) return ['▲','+'];
        else if (priceGap < 0) return ['▼','-'];
        return ['',''];
    }
    const [ arrow, indi ] = indicator();
    return (
        <div
            className={cx('ticker', { up: isUp, down: !isUp })}
        >
            <p className={styles.tick} style={{ display: 'inline-block'}}>{arrow}{indi}{priceGap.toFixed(2)}({indi}{profitage.toFixed(2)}%)</p>
        </div>
    )
};

export default Ticker;
