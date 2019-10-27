import * as React from 'react';
import {bind} from 'classnames/bind';
import { withRouter } from 'react-router-dom';
import * as styles from './styles/AccountMenu.scss';
const MenuListItems = ['account', 'transactions', 'portfolio'];

const menuStyles = bind(styles);
const AccountMenu: React.FunctionComponent<{
}> = () => (
    <ul
        className={styles.accountMenu}
    >
        {MenuListItems.map( item =>
            <li
                key={item}
            >{item}</li>)
        }
    </ul>
);

export default AccountMenu;
