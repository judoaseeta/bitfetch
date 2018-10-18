import * as React from 'react';
import * as styles from './styles/Line.scss';
const Line: React.SFC<{
    d: string;
}> = ({ d }) => (
    <path
        className={styles.line}
        d={d}
    />
);

export default Line;
