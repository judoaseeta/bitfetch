import * as React from 'react';
import { NavLink } from 'react-router-dom';
import * as styles from './styles/NavItem.scss';
const NavItem: React.SFC<{
    name: string;
    to: string;
}> = ({ name, to, }) =>(
    <li
        className={styles.item}
    >
        <NavLink
            activeStyle={{
                textDecoration: 'underline'
            }}
            to={to}
            exact={to === "/"}
        >
            {name}
        </NavLink>
    </li>
);

export default NavItem;
