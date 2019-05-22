import * as React from 'react';
import * as styles from './styles/AuthLabel.scss';
const AuthLabel: React.SFC<{
    htmlFor: string;
}> = ({ children, htmlFor, }) => (
    <label
        className={styles.label}
        htmlFor={htmlFor}
    >{children}</label>
);

export default AuthLabel;