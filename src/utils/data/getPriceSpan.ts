import Stack from './stack';

function getPriceSpan(data: CoinHistoData[]) {
    const stack = new Stack<number>();
    const spans: number[] = [];
    spans.push(1);
    stack.push(0);
    for(let i = 1; i < data.length; i++){
        while(!stack.isEmpty() && stack.top() && data[stack.top()!.data].close <= data[i].close) {
            stack.pop();
        }
        if(stack.isEmpty()) spans[i] = i + 1;
        else spans[i] = i - stack.top()!.data;
        stack.push(i);
    }
    return spans;
}
export default getPriceSpan;
