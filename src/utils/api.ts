
import * as io from 'socket.io-client';
import { from, Subject, of  } from 'rxjs';
import {MappedHistoData} from "./histoDataMapper";
import key from '../../ApiKey';

const API_KEY = key;
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




const addApiKeytoUrl = (url:string) => `${url}&api_key=${API_KEY}`;
/// create url of api call for currency data;
const createApiForCurrency = (queryTypeKey: keyof typeof  queryTypes, fsym?: string, tsym?: string) => {
    let queryType = queryTypes[queryTypeKey];
    return `${currenciesUrl}${queryType[0]}?fsym=${fsym ? fsym : 'BTC'}&tsym=${tsym ? tsym : 'USD'}&limit=${queryType[1]}${queryType[2] ? `&aggregate=${queryType[2]}`: ''}`;
};
export const generateUrlForCurrencyApi: (obj: { histo: string, fsym?: string, tsym?: string }) => string = ({ histo , fsym, tsym } ) => addApiKeytoUrl(createApiForCurrency(histo, fsym, tsym));

// api call for single data;

export const requestCurrencyData = async(obj: { histo: string, fsym?: string, tsym?: string }): Promise<MappedHistoData> => {
    try {
        const apiAddress = generateUrlForCurrencyApi(obj);
        const data =  await fetch(apiAddress);
        return data.json();
    } catch(err) {
        console.error(err);
        throw err;
    }
}


const requestMultiCoinData = (data: string[], histo: string, tsym?: string): Promise<MultiCoinResp[]> => Promise.all(data.map(async (coin) => {
    const data = await fetch(generateUrlForCurrencyApi({histo, fsym: coin, tsym} ));
    const jsoned = await data.json() as CoinHistoDataResp;
    return {name: coin, resp: jsoned}
}));

// currency data api call iteration
const fetchCoins = ( data: TopListData[], currentCoinSymbol: string, histo: string, tsym?: string,) => {
    const currentCoinIndex = data.findIndex((v) =>  v.CoinInfo.Name === currentCoinSymbol);
    const coinSymbolWithoutCurrent = [...data.slice(0, currentCoinIndex), ...data.slice(currentCoinIndex + 1, data.length - 1)]
        .map(d => d.CoinInfo.Name);
    return requestMultiCoinData(coinSymbolWithoutCurrent, histo, tsym);
};


// api call for  currencies data with fetchCoins()
export const requestTopCoinsData = async (currentCoinSymbol: string, histo?: string, tsym?: string) => {
    try {
        const topCoinList = await fetch(urlForTopList);
        const coins = await topCoinList.json() as TopListResp;
        const fetchedCoinData = await fetchCoins(coins.Data,currentCoinSymbol, histo = 'live');
        return fetchedCoinData;
        // return await fetchCoins(coins.Data, currentCoinSymbol, histo, tsym);
    } catch(err) {
        console.log(err);
        throw err;
    }
};



/// code for subscription;

export const createCurrentSubcription = (fsym: string, tsym?: string) => [`5~CCCAGG~${fsym}~${tsym ? tsym : 'USD'}`];
export const createCurrentsSubscription = (list:  { coin: string, tsym?: string }[]) => list.map(({coin, tsym}) => `5~CCCAGG~${coin}~${tsym ? tsym : 'USD'}`);
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