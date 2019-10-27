import { CryptoApiService  } from '../../services/cryptoApi/cryptoApi';
import { CurrencyApiGenArg } from '../../services/cryptoApi/type';
import { RawHistoDataResp } from '../../entities/histoData';
import HistoDataWithSpan from '../../entities/histoDataWithSpan';
import { CryptoApiInteractor } from './type';
import * as moment from "moment";
import Stack from "../../../../utils/data/stack";

class SpanDataInteractor extends CryptoApiInteractor<CurrencyApiGenArg, RawHistoDataResp, HistoDataWithSpan[]> {
    constructor(service: CryptoApiService<CurrencyApiGenArg, RawHistoDataResp>){
        super(service);
    }
    static getSpanDateLength() {
        const date = moment().subtract(1095, 'days');
    // get first day of that date
        const firstDate = date.startOf('month');
        const now = moment();
    // get how many days between now and firstdate since cryptocompare.com api doesn't provide way to do this.
        return now.diff(firstDate, 'days');
    }
    async request({ fsym, limit = SpanDataInteractor.getSpanDateLength() }: CurrencyApiGenArg) {
        const data = super.request({ fsym, limit});
        console.log(data);
        return data;
    }
    mapper(data: RawHistoDataResp) {
        const newData = data.Data.Data.filter( d => d.close !== 0 && d.high !== 0  && d.low !== 0 && d.open !== 0);
        const stack = new Stack<number>();
        const spans: number[] = [];
        const spannedData: HistoDataWithSpan[] = [];
        spans.push(1);
        stack.push(0);
        for(let i = 1; i < newData.length; i++){
            while(!stack.isEmpty() && stack.top() && newData[stack.top()!.data].close <= newData[i].close) {
                stack.pop();
            }
            if(stack.isEmpty()) spans[i] = i + 1;
            else spans[i] = i - stack.top()!.data;
            stack.push(i);
        }
        for(let i = 0; i < spans.length; i++) {
            spannedData.push(new HistoDataWithSpan(newData[i],spans[i]));
        }
        return spannedData;
    }
    async requestWithMapping({ fsym, limit = SpanDataInteractor.getSpanDateLength() }: CurrencyApiGenArg) {
        const data = await this.request({ fsym, limit});
        return this.mapper(data);
    }
}
export default SpanDataInteractor;
