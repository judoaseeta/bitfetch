import * as React from 'react'
import Portal from '../../utils/Portal';

import * as styles from './styles/Disconnected.scss';

const Disconnected: React.SFC<{
    isActive: boolean;
    reconnectCurrent : React.MouseEventHandler<HTMLSpanElement>;
}> = ({ isActive, reconnectCurrent, }) => (
    <Portal
        isActive={isActive}
    >
        <div
            className={styles.container}
        >
            <h4>Live price is disconnected.</h4>
            <p>Do you want to <span
                onClick={reconnectCurrent}
            >reconnect?</span></p>
        </div>
    </Portal>
);

export default Disconnected;
