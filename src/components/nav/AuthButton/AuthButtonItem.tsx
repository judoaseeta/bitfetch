import * as React from 'react';
import * as styles from './styles/AuthButtonItem.scss';
import { Link } from 'react-router-dom';
import { LocationDescriptor } from 'history';
const AuthButtonItem: React.FunctionComponent<{
    to?: LocationDescriptor;
    onClick?: React.MouseEventHandler<HTMLLIElement>
}> = ({ children,  to, onClick }) => (
    <li
        className={styles.container}
        onClick={onClick}
    >
        {
            to
                ? <Link
                    className={styles.link}
                    to={to}>{children}
                </Link>
                :
                <span  className={styles.link}>{children}</span>
        }
    </li>
);

export default AuthButtonItem;
