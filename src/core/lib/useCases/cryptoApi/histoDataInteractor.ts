import { CryptoApiService } from '../../services/cryptoApi/cryptoApi';
import { CurrencyApiGenArg } from '../../services/cryptoApi/type';
import { MappedHistoData, HistoDatasMapper, RawHistoDataResp, HistoType } from '../../entities/histoData';
import { CryptoApiInteractor } from "./type";

class HistoDataInteractor extends CryptoApiInteractor<CurrencyApiGenArg, RawHistoDataResp, MappedHistoData>  {
    constructor(service: CryptoApiService<CurrencyApiGenArg, RawHistoDataResp>){
        super(service);

    }
    mapper(arg: RawHistoDataResp) {
        return HistoDatasMapper(arg);
    }
    async requestWithMapping(reqArg: CurrencyApiGenArg) {
        const data = await this.request(reqArg);
        return this.mapper(data);
    }
}
export default HistoDataInteractor;
