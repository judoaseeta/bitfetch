import * as React from 'react';
import { bind } from 'classnames/bind';
import * as styles from './Portal.scss';
const cx = bind(styles);

const Portal: React.FunctionComponent<{
    isActive: boolean;
    isGlobal?: boolean;
}> = ({ children, isActive, isGlobal }) => (
    <div
        className={cx('container', {
            active: isActive,
            global: isGlobal
        })}
    >
        {children}
    </div>
);

export default Portal;