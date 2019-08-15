import * as React from 'react';
import { Link,withRouter, RouteComponentProps } from 'react-router-dom';
import { bind } from 'classnames/bind';
import * as styles from './styles/PageIndicatorItem.scss';

const cx = bind(styles);

const PageIndicatorItem: React.FunctionComponent<{
    currentPage: number;
    num: number;
    to: string;
} & RouteComponentProps> = ({ currentPage, num, location: { pathname } }) => (
    <li
        className={cx('indicatorItem', {
            'current': currentPage === num
        })}
    ><Link
        className={cx('link',{
            'current':currentPage === num
        })}
        to={{
        pathname: pathname,
        search:`?page=${num}`,
    }}>{num}</Link></li>
);

export default withRouter(PageIndicatorItem);
