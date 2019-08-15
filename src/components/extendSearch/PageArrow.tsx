import * as React from 'react';
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import * as styles from './styles/PageIndicatorItem.scss';

const PageArrow: React.FunctionComponent<{
    num: number;
    isLeft: boolean;
    isDouble: boolean;
}& RouteComponentProps> = ({ location: { pathname }, isDouble, isLeft, num}) => (
    <li
        className={styles.indicatorItem}
    ><Link
        className={styles.link}
        to={{
            pathname: pathname,
            search:`?page=${num}`,
        }}>
        {
            isDouble ? isLeft ? '◀◀' : '▶▶'
                :isLeft ? '◀': '▶'
        }
    </Link></li>
);

export default withRouter(PageArrow);
