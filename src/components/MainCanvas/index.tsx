import * as React from 'react';

import { RenderProps } from '../../containers/MainCanvas';
import Loading from '../../utils/puffLoader/Loading';
import * as styles from './styles/index.scss';

const MainCanvasCompo =
    React.forwardRef<HTMLCanvasElement, RenderProps>(({ width, height, isImageLoaded,onClick }, ref ) =>
        <div
            className={styles.container}
            onClick={onClick}
        >
                <canvas
                    className={styles.interactCanvas}
                    width={width}
                    height={height}
                />
                <canvas
                    className={styles.mainCanvas}
                    ref={ref}
                    width={width}
                    height={height}
                ></canvas>
                <Loading strokeWidth={10} isLoading={!isImageLoaded} strokeColor={'#f78fb3'}/>
        </div>
);

export default MainCanvasCompo;
