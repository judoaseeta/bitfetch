import * as React from 'react';
import { bind } from 'classnames/bind';
import * as styles from './Portal.scss';
const cx = bind(styles);
const Portal: React.SFC<{
    isActive: boolean;
    hasClose?: boolean;
    toggleActive?: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ children, isActive, hasClose, toggleActive }) => (
    <div
        className={cx('container', {
            active: isActive
        })}
    >
        {
            hasClose && <button onClick={toggleActive}>close</button>
        }
        {children}
    </div>
);

export default Portal;