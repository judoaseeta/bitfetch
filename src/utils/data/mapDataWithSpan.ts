interface SpannedHistoData extends CoinHistoData {
    span: number;
}
function mapDataWithSpan(data: CoinHistoData[], spanData: number[], targetIndex: number): SpannedHistoData[] {
    let result: SpannedHistoData[] = [];
    let startIndex:number;
    let endIndex:number;
    if(targetIndex < 60) startIndex = 0;
    else {
        startIndex = targetIndex - 60;
        /*
        if(spanData[targetIndex] > 60 && targetIndex - spanData[targetIndex] + 1 >= 0) {
            startIndex = targetIndex - spanData[targetIndex] + 1;
        } else {

        }
        */
    }
    if(targetIndex + 30 > data.length - 1) endIndex = data.length - 1;
    else endIndex = targetIndex + 30;
    for(let i = startIndex; i < endIndex + 1; i++) {
        result.push({
            ...data[i],
            span: spanData[i],
        })
    }
    return result;
}
export default mapDataWithSpan;
