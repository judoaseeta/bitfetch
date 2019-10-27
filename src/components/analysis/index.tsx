import * as React from 'react';
import {AnalType, RenderProps} from '../../containers/Analysis';
import Span from './Span/Span';
import Chord from './Chord';
import * as styles from "./styles/index.scss";
import AnalNav from "./Nav";

const AnalysisCompo:React.FunctionComponent<RenderProps> =
    ({
         analType,
         canvasRef,
         interactRef,
         width,
         height,
         spanMouseHandler,
         spanDisInterAct,
         setType
    }) =>
    <div
        className={styles.container}
    >
        <header>Analysis </header>
        <AnalNav
            analType={analType}
            setType={setType}
        />
        <div
            className={styles.inner}
        >
            {
                analType === AnalType.SPAN
                    ? <Span
                            canvasRef={canvasRef}
                            interactRef={interactRef}
                            width={width}
                            height={height}
                            onMouseEnter={spanMouseHandler}
                            onMouseLeave={spanDisInterAct}
                    />
                    :''
            }
            {
                analType === AnalType.PAIR
                    ? <Chord />
                    :''
            }
        </div>
    </div>;

export default AnalysisCompo;