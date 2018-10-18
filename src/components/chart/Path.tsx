import *as React from 'react';
import { bind } from 'classnames/bind';
import * as styles from './styles/Path.scss';
const cx = bind(styles);
class Path extends React.Component<{
    d: string;
    type: string;
}, {}> {

    render() {
        const { d, type } = this.props;
        return (
            <path
                className={cx('path',  {
                    loadingPath: type === 'loading'
                })}
                d={d}
            />
        )
    }
};

export default Path;