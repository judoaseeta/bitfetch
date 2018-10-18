type Diff<T extends string | number | symbol, U extends string | number | symbol> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T , K>>;
declare module '*.scss' {
    interface IClassNames {
        [className: string]: string
    }
    const classNames: IClassNames;
    export = classNames;
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
interface CoinHistoData {
    time: number;
    close: number;
    high: number;
    low: number;
    open: number;
    volumefrom: number;
    volumeto: number;
}
interface CoinListResp {
    Response: string;
    Message: string;
    Data: {
        [k: string] : CoinListData;
    }
}
interface TopListResp {
    Message: string;
    Type: number;
    SponseredData: any[];
    Data: TopListData[];
}
interface TopListData {
    CoinInfo: {
        Id: string;
        Name: string;
        FullName: string;
        Internal: string;
        ImageUrl: string;
        Url: string;
        Algorithm: string;
        ProofTYpe: string;
        NetHashesPerSecond: number;
        BlockNumber: number;
        BlockTime: number;
        BlockReward: number;
        Type: number;
        DocumentType: string;
    }
    ConversionInfo: {
        Conversion: string;
        ConversionSymbol: string;
        CurrencyFrom: string;
        CurrencyTo: string;
        Market: string;
        Supply: number;
        TotalVolume24H: number;
        SubBase: string;
        SubsNeeded: string[];
        RAW: string;
    }
}
interface CoinListData {
    Id: string;
    Url: string;
    ImageUrl: string;
    Name: string;
    Symbol: string;
    CoinName: string;
    FullName: string;
    Algorithm: string;
    ProofType: string;
    FullyPremined: string;
    TotalCoinSupply: string;
    BuiltOn: string;
    SmartContractAddress: string;
    PreMinedValue: string;
    TotalCoinsFreeFloat: string;
    SortOrder: string;
    Sponsored: boolean;
    IsTrading: boolean;
}
interface MultiCoinResp {
    name: string;
    resp: Promise<CoinHistoDataResp>;
}
declare interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    __initialData__: any;
}