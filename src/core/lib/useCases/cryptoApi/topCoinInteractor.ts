import { CryptoApiService } from '../../services/cryptoApi/cryptoApi';
import {TopListUrlGenArg } from '../../services/cryptoApi/type';
import TopCoin, { RawTopCoinResp }from '../../entities/topCoin';
import { CryptoApiInteractor } from './type';

class TopCoinInteractor extends CryptoApiInteractor <TopListUrlGenArg, RawTopCoinResp, TopCoin[]>{
    constructor(service : CryptoApiService<TopListUrlGenArg, RawTopCoinResp>) {
        super(service);
    }
    mapper(data: RawTopCoinResp) {
        return data.Data.map( d => new TopCoin(d.CoinInfo));
    }
    async requestWithMapping(reqArg: TopListUrlGenArg): Promise<TopCoin[]> {
        const data = await this.request(reqArg);
        return this.mapper(data);
    }
}
export default TopCoinInteractor;
