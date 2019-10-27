import { addApiKeytoUrl  } from './urlGens';
import { ApiServiceURLGen } from './type';

export interface CryptoApiService<A,T>{
    urlGen : ApiServiceURLGen<A>;
    request(arg: A) : Promise<T>
}
class CryptoApi<A,T> implements CryptoApiService<A,T>{
    urlGen: ApiServiceURLGen<A>;
    constructor(urlGen: ApiServiceURLGen<A>) {
        this.urlGen = urlGen;
        this.request = this.request.bind(this);
    }
    async request(arg: A): Promise<T> {
        try {
            const data = await fetch(addApiKeytoUrl(this.urlGen(arg)));
            return data.json() as Promise<T>;
        } catch(err) {
            console.error(err);
            throw err;
        }
    }
}

export default CryptoApi;
