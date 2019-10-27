import * as React from 'react';
import Portal from '../component/Portal';
import Puff from '../animeUtils/Puff';
import * as styles from './Loading.scss';
const Loading: React.FunctionComponent<{
    strokeColor?: string;
    strokeWidth: number
    isLoading: boolean;
}> = ({  isLoading, strokeColor, strokeWidth }) => (
    <Portal
        isActive={isLoading}
    >
        <div
            className={styles.loader}
        >
            {
                isLoading && <Puff
                    className={styles.puff}
                    strokeColor={strokeColor}
                    strokeWidth={strokeWidth}
                    duration={3000}
                />
            }
        </div>
    </Portal>
);

export default Loading;

