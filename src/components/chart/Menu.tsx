import * as React from 'react';
import { bind } from 'classnames/bind';
import Portal from '../../utils/Portal';
import * as styles from './styles/Menu.scss';

const cx = bind(styles);
const Menu: React.SFC<{
    isMenuOn: boolean;
    toggleMenu: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ isMenuOn, toggleMenu }) => (
    <Portal
        isActive={isMenuOn}
        hasClose={true}
        toggleActive={toggleMenu}
    >
        <div
            className={cx('menu')}
        >
            ballo
        </div>
    </Portal>
);

export default Menu;