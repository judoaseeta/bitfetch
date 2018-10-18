import * as React from 'react';
import { bind } from 'classnames/bind';
import * as styles from './Portal.scss';
const cx = bind(styles);
const Portal: React.SFC<{
    isActive: boolean;
}> = ({ children, isActive, }) => (
    <div
        className={cx('container', {
            active: isActive
        })}
    >
        {children}
    </div>
);

export default Portal;