import {HistoType} from "../../entities/histoData";

export interface TopListUrlGenArg{
    limit?: number,
    tsym?: string
}

export interface CurrencyApiGenArg {
    histo?: HistoType,
    fsym: string,
    tsym?: string,
    limit?: number
}
export interface ArticleApiGenArg {
    categories?: string[];
    feeds?: string[];
    lang?: string;
}
export type ApiServiceURLGen<A> = (arg: A) => string;