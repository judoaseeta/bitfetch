import * as React from 'react'
import Portal from '../../utils/component/Portal';

import * as styles from './styles/Disconnected.scss';

const Disconnected: React.SFC<{
    isActive: boolean;
    listenCurrent : React.MouseEventHandler<HTMLSpanElement>;
}> = ({ isActive, listenCurrent, }) => (
    <Portal
        isActive={isActive}
    >
        <div
            className={styles.container}
        >
            <h4>Live price is disconnected.</h4>
            <p>Do you want to <span
                onClick={listenCurrent}
            >reconnect?</span></p>
        </div>
    </Portal>
);

export default Disconnected;
