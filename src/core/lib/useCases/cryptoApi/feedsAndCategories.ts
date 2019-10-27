import Feed, { RawFeed } from '../../entities/cryptoArticleFeed';
import Category ,{ RawCategory } from '../../entities/cryptoCategory';
import { CryptoApiInteractor } from './type';
import { CryptoApiService } from '../../services/cryptoApi/cryptoApi';

interface RawFeedsAndCategories {
    Data: {
        Categories: RawCategory[],
        Feeds: RawFeed[]
    }
}
interface MappedFeedsAndCategories {
    Feeds: Feed[];
    Categories: Category[];
}
class FeedsAndCategories extends CryptoApiInteractor<{}, RawFeedsAndCategories, MappedFeedsAndCategories> {
    constructor(service: CryptoApiService<{}, RawFeedsAndCategories>) {
        super(service);
    }
    mapper(arg: RawFeedsAndCategories): MappedFeedsAndCategories {
        return {
            Categories: arg.Data.Categories.map( d=> new Category(d)),
            Feeds: arg.Data.Feeds.map( d => new Feed(d)),
        };
    }

    async requestWithMapping(reqArg: {}): Promise<MappedFeedsAndCategories> {
        const rawData = await this.request({});
        return this.mapper(rawData);
    }
}
export default FeedsAndCategories;
