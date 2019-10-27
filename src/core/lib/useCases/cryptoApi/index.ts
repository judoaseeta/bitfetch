import CoinListInteractor from './coinListInteractor';
import HistoDataInteractor from './histoDataInteractor';
import HistoDatasInteractor from './histoDatas';
import SpannedHistoDataInteractor from './spanDataInteractor';
import TopCoinInteractor from './topCoinInteractor';
import CurrencyInteractor from './currencyInteractor';
import ArticlesInteractor from './articleInteractor';
import FeedsAndCategories from './feedsAndCategories';
import CryptoApi from '../../services/cryptoApi/cryptoApi';
import { coinListUrlGen, generateUrlForCurrencyApi, topListUrlGen, cryptoApiForArticles } from '../../services/cryptoApi/urlGens';
import { TopListUrlGenArg } from '../../services/cryptoApi/type';
import TopCoin, {RawTopCoinResp} from '../../entities/topCoin';
import CryptoWebSocket, {createCurrentSubcription} from "../../services/cryptoApi/cryptoWebSocket";
import { feedsAndCategoriesGen } from '../../services/cryptoApi/urlGens';

class CryptoApiInterActors {
    private constructor() {

    }
    static getHistoData() {
        return new HistoDataInteractor(new CryptoApi(generateUrlForCurrencyApi)) as HistoDataInteractor;
    }
    static getHistoDatas() {
        return new HistoDatasInteractor<TopCoin>();
    }
    static getSpannedHistoData() {
        return new SpannedHistoDataInteractor(new CryptoApi(generateUrlForCurrencyApi)) as SpannedHistoDataInteractor;
    }
    static getCoinList() {
        return new CoinListInteractor<{}>(new CryptoApi(coinListUrlGen)) as CoinListInteractor<{}>;
    }
    static getCryptoSubscription() {
        return new CurrencyInteractor(new CryptoWebSocket(createCurrentSubcription));
    }
    static getTopCoins() {
        return new TopCoinInteractor(new CryptoApi<TopListUrlGenArg, RawTopCoinResp>(topListUrlGen))
    }
    static getArticles() {
        return new ArticlesInteractor(new CryptoApi(cryptoApiForArticles));
    }
    static getArticleFeedsAndCategories() {
        return new FeedsAndCategories(new CryptoApi(feedsAndCategoriesGen));
    }
}

export default CryptoApiInterActors;
