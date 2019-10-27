import * as React from 'react';
import * as styles from "../../components/nav/styles/SearchResultItem.scss";

const highlightedSpan: React.FunctionComponent<{
    highlightClassName?: string;
    highlightedString: string;
    targetString: string;
}> = ({ highlightClassName, highlightedString, targetString }) => {
    let replacedString = highlightedString.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    let regex = new RegExp(replacedString, 'i');
    let filtered = targetString.search(regex);
    if(filtered === 0) {
        return <><span className={highlightClassName}>{targetString.slice(0, replacedString.length)}</span>{targetString.slice(replacedString.length)}</>
    } else if(filtered > 0) {
        const length = filtered + replacedString.length ;
        return <>{targetString.slice(0, filtered)}<span className={highlightClassName}>{targetString.slice(filtered, length)}</span>{targetString.slice(length)}</>
    }
    return <>{targetString}</>;
};

export default highlightedSpan;

