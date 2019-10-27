import { CryptoApiService } from '../../services/cryptoApi/cryptoApi';
import { ArticleApiGenArg } from '../../services/cryptoApi/type';
import { CryptoApiInteractor } from "./type";
import CryptoArticle, { RawCryptoArticleResp } from '../../entities/cryptoArticle';

class ArticleInteractor extends CryptoApiInteractor<ArticleApiGenArg, RawCryptoArticleResp, CryptoArticle[]>{
    constructor(service: CryptoApiService<ArticleApiGenArg, RawCryptoArticleResp>) {
        super(service);
    }
    mapper(arg: RawCryptoArticleResp): CryptoArticle[] {
        return arg.Data.map( rawD => new CryptoArticle(rawD));
    }

    async requestWithMapping(reqArg: ArticleApiGenArg): Promise<CryptoArticle[]> {
        const rawData = await this.request(reqArg);
        return this.mapper(rawData);
    }
}

export default ArticleInteractor;
