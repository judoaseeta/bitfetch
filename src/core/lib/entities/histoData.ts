export interface RawHistoDataResp {
    Data: RawHistoDataRespData;
    TimeFrom: number;
    TimeTo: number;
    __proto__: Object;
    HasWarning: boolean;
    Message: string;
    RateLimit: any;
    Response: string;
    Type: number
}
export interface RawHistoDataRespData {
    Response: string;
    Type: number;
    Aggregated: boolean;
    Data: RawHistoData[];
    TimeTo: number;
    TimeFrom: number;
    FirstValueInArray: boolean;
}
export interface RawHistoData {
    time: number;
    close: number;
    high: number;
    low: number;
    open: number;
    volumefrom: number;
    volumeto: number;
}

export interface MappedHistoData extends Omit<RawHistoDataRespData, 'Data'> {
    Data: HistoData[];
}
type QueryTypes = Dictionary<[string, number] | [string, number, number]>;


export enum HistoType {
    live = 'LIVE',
    threeDay = '3DAY',
    oneMonth = '1MONTH',
    threeMonth = '3MONTH',
    sixMonth = '6MONTH',
    oneYear = '1YEAR',
}
export const queryTypes: QueryTypes = {
    [HistoType.live] : ['histohour', 24],
    [HistoType.threeDay]: ['histohour', 36, 2   ],
    [HistoType.oneMonth]: ['histoday', 30   ],
    [HistoType.threeMonth]: ['histoday', 90],
    [HistoType.sixMonth]: ['histoday', 90, 2],
    [HistoType.oneYear] : ['histoday', 91, 4],
};



export class HistoData {
    private _date: Date;
    private _time: number;
    private _close: number;
    private _high: number;
    private _low: number;
    private _open: number;
    private _volumefrom: number;
    private _volumeto: number;
    constructor({ time, close, high, low ,open, volumefrom, volumeto}: RawHistoData) {
        this._date = new Date(time * 1000);
        this._time = time;
        this._close = close;
        this._high = high;
        this._low = low;
        this._open = open;
        this._close = close;
        this._volumefrom = volumefrom;
        this._volumeto = volumeto;
    }
    get time() {
        return this._time;
    }
    get date() {
        return this._date;
    }
    get close() {
        return this._close;
    }
    set close(newClose: number) {
        this._close = newClose;
    }
    get open() {
        return this._open;
    }
    get volumefrom() {
        return this._volumefrom;
    }
    get volumeto() {
        return this._volumeto
    }
    get high() {
        return this._high;
    }
    set high(newHigh: number) {
        this._high = newHigh;
    }
    get low() {
        return this._low;
    }
    set low(newLow: number) {
        this._low = newLow;
    }
}

export function HistoDatasMapper(rawDataResponse: RawHistoDataResp): MappedHistoData {
    return {
        ...rawDataResponse.Data,
        Data: rawDataResponse.Data.Data.map( data => new HistoData(data))
    }
}
