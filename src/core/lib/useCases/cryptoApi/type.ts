import { CryptoApiService } from '../../services/cryptoApi/cryptoApi';
import {HistoType} from "../../entities/histoData";
export abstract class CryptoApiInteractor<A, R, F> {
    private service:  CryptoApiService<A,R>;
    constructor(service: CryptoApiService<A,R>) {
        this.service = service;
        this.request = this.request.bind(this);
        this.mapper = this.mapper.bind(this);
        this.requestWithMapping = this.requestWithMapping.bind(this);
    }
    async request(reqArg: A) {
        return this.service.request(reqArg);
    }
    abstract mapper(arg: R) : F
    abstract async requestWithMapping(reqArg: A): Promise<F>
}


export interface Input {
    fsym: string;
    tsym: string;
}