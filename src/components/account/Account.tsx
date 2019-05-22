import * as React from 'react';
import * as styles from './styles/Account.scss';

import InnerContainer from './InnerContainer';
const Account: React.SFC<{}> =() => (
    <div className={styles.container}>
        <InnerContainer />
    </div>
);

export default Account;
