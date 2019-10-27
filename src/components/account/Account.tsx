import * as React from 'react';

import * as styles from './styles/Account.scss';

import AccountMenu from './AccountMenu';
import InnerContainer from './InnerContainer';

import { RenderProps } from '../../containers/Account';
const Account: React.FunctionComponent<RenderProps> =() => (
    <div className={styles.container}>
        <AccountMenu />
        <InnerContainer />
    </div>
);

export default Account;
