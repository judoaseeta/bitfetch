import { HistoData, RawHistoData } from './histoData';
class HistoDataWithSpan extends HistoData{
    private _span: number;
    constructor(arg: RawHistoData, span: number) {
        super(arg);
        this._span = span;
    }
    get span() {
        return this._span;
    }
}

export default HistoDataWithSpan
