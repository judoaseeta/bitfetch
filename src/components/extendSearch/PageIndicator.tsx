import * as React from 'react';

import Item from './PageIndicatorItem';
import PageArrow from './PageArrow';
import DecimalAdjust from '../../utils/decimalAdjust';
import * as styles from './styles/PageIndicator.scss';
const iterateList = (list: JSX.Element[], start:number,range: number, currentPage: number) => {
    if( start === range) start = range - 10;
    for(let i = start; i < range; i++) {
        list.push(
            <Item
                key={i}
                currentPage={currentPage}
                num={i + 1}
                to={'/'}
            />
        );
    }
};
const PageIndicator: React.FunctionComponent<{
    listLength: number;
    itemNum: number;
    currentPage: number;
}> = ({ listLength, itemNum, currentPage }) => {
    const renderList = () => {
        let pageList: JSX.Element[] = [];
        const pageNum = Math.ceil( listLength /itemNum);
        if(listLength <= itemNum * 10) {
           iterateList(pageList, 0, pageNum, currentPage);
        } else {
            if(currentPage <= 10) {
                iterateList(pageList, 0, 10, currentPage);
                pageList.push(
                    <PageArrow
                        key={11}
                        isDouble={false}
                        isLeft={false}
                        num={11}
                    />
                );
                pageList.push(
                    <PageArrow
                        key={12}
                        isDouble={true}
                        isLeft={false}
                        num={pageNum}
                    />
                )
            } else {
                const startNum = DecimalAdjust('floor',currentPage, 1);
                const endNum = Math.min(DecimalAdjust('ceil',currentPage, 1), pageNum);
                pageList.push(<PageArrow
                    key={endNum + 1}
                    isDouble={true}
                    isLeft={true}
                    num={1}
                />);
                pageList.push(<PageArrow
                    key={endNum + 2}
                    isDouble={false}
                    isLeft={true}
                    num={startNum}
                />);
                iterateList(pageList, startNum, endNum, currentPage);
                pageList.push(<PageArrow
                    key={endNum + 3}
                    isDouble={false}
                    isLeft={false}
                    num={endNum + 1}
                />);
                pageList.push(<PageArrow
                    key={endNum + 4}
                    isDouble={true}
                    isLeft={false}
                    num={pageNum}
                />);
            }

        }
        return pageList;
    };
    return (
        <ul
            className={styles.indicator}
        >{renderList()}</ul>
    );
};

export default PageIndicator;
