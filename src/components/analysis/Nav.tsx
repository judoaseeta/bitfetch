import * as React from 'react';
import { bind } from 'classnames/bind';

import { AnalType } from '../../containers/Analysis';
import * as styles from './styles/Nav.scss';
const cx = bind(styles);
const Nav: React.FunctionComponent<{
    analType: AnalType,
    setType: (type: keyof typeof AnalType) => React.MouseEventHandler<HTMLLIElement>;
}> = ({ analType, setType }) =>
    <ul
        className={styles.nav}
    >
        {
            Object.entries(AnalType).map(  ([key, val])  =>
                <li
                    className={cx('item', {
                        selected :val === analType
                    })}
                    key={val}
                    onClick={setType(key as keyof typeof AnalType)}
                >{val}</li>
            )
        }
    </ul>;

export default Nav;
