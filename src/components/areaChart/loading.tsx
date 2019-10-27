import * as React from 'react';
import FaIcon from '../../utils/component/faIcon';
import Portal from '../../utils/component/Portal';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import * as styles from './styles/loading.scss';
const Loading: React.FunctionComponent<{
    isLoading: boolean;
}> = ({ isLoading }) =>
    <Portal isActive={isLoading}>
        <FaIcon
            className={styles.spinner}
            icon={faSpinner}
            spin
        />
    </Portal>;

export default Loading;