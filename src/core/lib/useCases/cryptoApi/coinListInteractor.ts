import { CryptoApiService } from '../../services/cryptoApi/cryptoApi';
import CoinListData, {RawCoinListData} from "../../entities/coinListData";
import { CryptoApiInteractor } from './type';
export interface RawCoinListResp {
    Response: string;
    Message: string;
    Data: {
        [k: string] : RawCoinListData;
    }
}
class CoinListInteractor<D extends {}> extends CryptoApiInteractor<D, RawCoinListResp, any>{
    constructor(service: CryptoApiService<D, RawCoinListResp>) {
        super(service);
        this.mapper = this.mapper.bind(this);
        this.requestWithMapping = this.requestWithMapping.bind(this);
    }
    mapper(data: RawCoinListResp) {
        if (data.Response === 'Fail') {
            throw new Error(data.Message);
        }
        const rawData = data.Data;
        console.log(data    );
        const map = new Map<string, CoinListData>();
        for(let key in rawData) {
            map.set(key, new CoinListData(rawData[key]));
        }
        return map;
    }

    async requestWithMapping(arg: D) {
        const data = await this.request(arg);
        return this.mapper(data);
    }
}

export default CoinListInteractor;
