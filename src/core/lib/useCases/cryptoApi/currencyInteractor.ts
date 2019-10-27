import { CryptoWebSocketService } from '../../services/cryptoApi/cryptoWebSocket';
import { Input } from './type';

class CurrencyInteractor {
    private service: CryptoWebSocketService<Input>;
    constructor(service: CryptoWebSocketService<Input>) {
        this.service = service;

        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
    }
    subscribe(sub: Input) {
        return this.service.subscribe(sub);
    }
    unsubscribe() {
        this.service.unsubscribe();
    }
}

export default CurrencyInteractor;
