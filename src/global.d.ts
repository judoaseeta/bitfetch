declare interface Window {
    __initialData__: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    __authConfig__: any;
}
declare interface NodeModule {

}
type Diff<T extends string | number | symbol, U extends string | number | symbol> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T , K>>;

// declaration for css module

declare module '*.scss' {
    interface IClassNames {
        [className: string]: string
    }
    const classNames: IClassNames;
    export = classNames;
}
declare module "*.png" {
    const value: any;
    export = value;
}
interface Dictionary<T> {
    [key: string]: T;
}

interface CoinListItem {
    Id: string;
    CoinName: string;
    Symbol: string;
}
// type definitions for Coin Data Api
interface CoinHistoDataResp {
    Response: string;
    Type: number;
    Aggregated: boolean;
    Data: CoinHistoData[];
    TimeTo: number;
    TimeFrom: number;
    FirstValueInArray: boolean;
}
interface Rep {
    Data: CoinHistoDataResp
    TimeFrom: number;
    TimeTo: number;
    __proto__: Object;
    HasWarning: boolean;
    Message: string;
    RateLimit: any;
    Response: string;
    Type: number
}
interface CoinHistoData {
    time: number;
    close: number;
    high: number;
    low: number;
    open: number;
    volumefrom: number;
    volumeto: number;
}

declare enum AuthInputType {
    email = 'email',
    password = 'password',
    name = 'name',
}

type TradingPairData = {
    exchange: string;
    fromSymbol: string;
    toSymbol: string;
    volume24h: number;
    volume24hTo: number;
}

declare enum CoinTradeType {
    BUY = "2",
    SELL = "1"
}
interface CoinTradeDecodedData {
    F: CoinTradeType;
    FSYM: string; // fsym
    ID: string;
    M: string; //exchange
    P: string;// price
    Q: string; // quantity
    T: string;
    TOTAL: string;// total
    TS: string;
    TSYM: string; // targetsym
}
