import CryptoApi from '../../services/cryptoApi/cryptoApi';
import { generateUrlForCurrencyApi } from '../../services/cryptoApi/urlGens';
import HistoDataInteractor from './histoDataInteractor';
import { HistoType } from '../../entities/histoData';


export type HistoDatasType = {
    name: string;
}
class HistoDatas<Data extends HistoDatasType> {
    constructor( ) {
        this.request = this.request.bind(this);
    }
    async request(data: Data[], tsym?: string, histo?: HistoType){
        const histoResps = await data.map( async (d) => {
            const data =  await new HistoDataInteractor(new CryptoApi(generateUrlForCurrencyApi)).requestWithMapping({ fsym: d.name, tsym: tsym ? tsym : "USD", histo: histo? histo : HistoType.live });
            return {
                coin: d.name,
                data: data.Data
            }
        });

        const result =  await Promise.all(histoResps);
        return result;
    }
}

export default HistoDatas;
