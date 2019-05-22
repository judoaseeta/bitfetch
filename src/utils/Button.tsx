import * as React from 'react';
import { bind } from 'classnames/bind';
import * as styles from './styles/Button.scss';
const cx = bind(styles);

const Button: React.SFC<{
    disabled: boolean;
}> = ({ disabled, children }) => (
    <button
        className={cx('button')}
        disabled={disabled}
    >{children}</button>
);

export default Button;