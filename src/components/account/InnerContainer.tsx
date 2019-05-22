import * as React from 'react';
import * as styles from './styles/InnerContainer.scss';

import Transactions from './Transactions';
const InnerContainer: React.SFC<{}> = (props) => (
    <div
        className={styles.innerContainer}
    >
        <Transactions />
    </div>
)

export default InnerContainer;
