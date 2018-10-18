// @ts-ignore
import DecodeMessage from './decodeMessage';
import * as io from 'socket.io-client';
import { from, Subject, of  } from 'rxjs';

export const coinListUrl = 'https://min-api.cryptocompare.com/data/all/coinlist';
const currenciesUrl = 'https://min-api.cryptocompare.com/data/';
const urlForTopList = 'https://min-api.cryptocompare.com/data/top/totalvol?limit=10&tsym=USD';
type QueryTypes = Dictionary<[string, number] | [string, number, boolean]>;
export const queryTypes: QueryTypes = {
    live : ['histohour', 24],
    '3d': ['histohour', 72],
    '1m': ['histoday', 30],
    '3m': ['histoday', 90],
    '6m': ['histoday', 180]
};





const createApiForCurrency = (queryTypeKey: keyof typeof  queryTypes, fsym?: string, tsym?: string) => {
    let queryType = queryTypes[queryTypeKey];
    return `${currenciesUrl}${queryType[0]}?fsym=${fsym ? fsym : 'BTC'}&tsym=${tsym ? tsym : 'USD'}&limit=${queryType[1]}${queryType[2] ? `&aggregate=${queryType[2]}`: ''}`;
};
export const generateUrlForCurrencyApi: (obj: { histo: string, fsym?: string, tsym?: string }) => string = ({ histo , fsym, tsym } ) => createApiForCurrency(histo, fsym, tsym);
const requestMultiCoinData = (data: string[], histo: string, tsym?: string): Promise<MultiCoinResp[]> => Promise.all(data.map((coin) =>(
    {name: coin, resp: fetch(generateUrlForCurrencyApi({histo, fsym: coin, tsym} )).then(res => res.json() as Promise<CoinHistoDataResp>)}
)));
const fetchCoins = ( data: TopListData[], currentCoinSymbol: string, histo: string, tsym?: string,) => {
    const currentCoinIndex = data.findIndex((v) =>  v.CoinInfo.Name === currentCoinSymbol);
    const coinSymbolWithoutCurrent = [...data.slice(0, currentCoinIndex), ...data.slice(currentCoinIndex + 1, data.length)]
                                        .map(d => d.CoinInfo.Name);
    return requestMultiCoinData(coinSymbolWithoutCurrent, histo, tsym);
};
export const requestTopCoinData = async (currentCoinSymbol: string, histo: string, tsym?: string) => {
    try {
        const topCoinList = await fetch(urlForTopList);
        const coins = await topCoinList.json() as TopListResp;
        return await fetchCoins(coins.Data, currentCoinSymbol, histo, tsym);
    } catch(err) {
        console.log(err);
        throw err;
    }
};

/// code for subscription;

export const createCurrentSubcription = (fsym: string, tsym?: string) => [`5~CCCAGG~${fsym}~${tsym ? tsym : 'USD'}`];
export const createCurrentsSubscription = (list:  { fsym: string, tsym?: string }[]) => list.map(({fsym, tsym}) => `5~CCCAGG~${fsym}~${tsym ? tsym : 'USD'}`);
const socketUrl = 'https://streamer.cryptocompare.com/';
export const createSocketCoin = (sub: string[]) => {
    let socket = io(socketUrl);
    let marketSub = new Subject<string>();
    let marketObservable = from(marketSub);
    socket.on('connect', () => {
        socket.emit('SubAdd', { subs: sub });
    });
    socket.on('m', (data: string) => {
        marketSub.next(data);
    });
    socket.on('disconnect', () => {
        marketSub.error(new Error('disconnected'));
    });
    return {
        observable: marketObservable,
        unsubscribe: () => socket.disconnect()
    };
};
