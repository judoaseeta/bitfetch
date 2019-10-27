import { HistoType, queryTypes } from '../../entities/histoData';

import { ApiServiceURLGen, TopListUrlGenArg, CurrencyApiGenArg, ArticleApiGenArg } from './type';

export const addApiKeytoUrl = (url:string) => `${url}`;


export const topListUrlGen: ApiServiceURLGen<TopListUrlGenArg> = ({limit, tsym }:TopListUrlGenArg) => `https://min-api.cryptocompare.com/data/top/totalvolfull?limit=${limit ? limit : 10}&tsym=${tsym ? tsym : 'USD'}`;

const cryptoCompareUrl = 'https://min-api.cryptocompare.com/data/v2/';
const createApiForCurrency = ({fsym, limit, histo, tsym}: CurrencyApiGenArg) => {
    if(histo) {
        let queryType = queryTypes[histo];
        return `${cryptoCompareUrl}${queryType[0]}?fsym=${fsym}&tsym=${tsym ? tsym : 'USD'}&limit=${queryType[1]}${queryType[2] ? `&aggregate=${queryType[2]}`: ''}`;
    }
    return `${cryptoCompareUrl}histoday?fsym=${fsym}&tsym=${tsym ? tsym : 'USD'}&limit=${limit}`;
};
export const cryptoApiForArticles : ApiServiceURLGen<ArticleApiGenArg> = ({ categories, feeds, lang }) => {
    const Categories = categories ? `?categories=${categories.join(',')}` : '';
    const Feeds = feeds? `?feeds=${feeds.join(',')}`: '';
    const Lang = lang ? `?lang=${lang}` : '?lang=EN';
    return `${cryptoCompareUrl}news/${Categories}${Feeds}${Lang}`;
};
export const generateUrlForCurrencyApi: ApiServiceURLGen<CurrencyApiGenArg>= ({ histo , fsym, tsym, limit } ) => createApiForCurrency({ fsym, histo, tsym, limit});

export const coinListUrlGen: ApiServiceURLGen<{}> = () => 'https://min-api.cryptocompare.com/data/all/coinlist';

export const feedsAndCategoriesGen: ApiServiceURLGen<{}> = () => 'https://min-api.cryptocompare.com/data/news/feedsandcategories';