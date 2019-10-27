import {from, Observable, Subject} from "rxjs";
import * as io from "socket.io-client";
import {Input} from "../../useCases/cryptoApi/type";



type SubGen<A> = (arg: A) => string[];
export const createCurrentSubcription:SubGen<Input> = ({fsym, tsym } : Input) => [`5~CCCAGG~${fsym}~USD`];
export type CurrentsGen =  SubGen<Input[]>
export const createCurrentsSubscription:CurrentsGen = (list:  { fsym: string, tsym?: string }[]) => list.map(({fsym, tsym}) => `5~CCCAGG~${fsym}~${tsym ? tsym : 'USD'}`);
export interface CryptoWebSocketService<A>{
    subscribe(arg: A): Observable<string>;
    unsubscribe(): void;
}
class CryptoWebSocket<A> implements CryptoWebSocketService<A>{
    private subGen: SubGen<A>;
    private static socketUrl = 'https://streamer.cryptocompare.com/';
    private socket: any;
    private subject: Subject<string>;
    private subObservable: Observable<string>;
    constructor(subGen: SubGen<A>) {
        this.subGen = subGen;
        this.socket = io(CryptoWebSocket.socketUrl);
        this.subject = new Subject<string>();
        this.subObservable = from(this.subject);
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
    }
    subscribe(sub: A) {
        this.socket.on('connect', () => {
            const subs = this.subGen(sub);
            this.socket.emit('SubAdd', { subs: subs });
        });
        this.socket.on('m', (data: string) => {
            this.subject.next(data);
        });
        this.socket.on('disconnect', (reason: string) => {
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server
                this.subject.error(new Error('disconnected'));
                this.socket.open();
            } else if(reason === 'io client disconnect') {
                // when the disconnection was on client side , don't throw error
                console.log('socket off');
            }
        });
        return this.subObservable;
    }
    unsubscribe() {
        this.socket.close();
    }
}

export default CryptoWebSocket;
