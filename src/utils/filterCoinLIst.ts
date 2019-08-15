import {from, Subject } from 'rxjs';
import {map, distinctUntilChanged, debounceTime} from 'rxjs/operators';


const filterSubject = (coinList: Map<string, CoinListData>, keyword: string ) => {
    const listenSubject = new Subject<CoinListData[]>();
    const observable = from(listenSubject);
    const eventSubject = new Subject<{
        coinList: Map<string, CoinListData>, keyword: string
    }>();
    eventSubject.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        map((d => {
            let result: CoinListData[] = [];
            const upperCasedKeyword = d.keyword.toUpperCase();
            // to replace any unnecessary characters such as -[]{}()*+?.,\^.
            let replacedString = d.keyword.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
            if(replacedString === '') {
                return [];
            }

            let regex = new RegExp(replacedString, 'i');
            for (let [key, value] of d.coinList) {
                if (regex.test(key)) {
                    if(key === upperCasedKeyword) {
                        result = [value, ...result];
                    } else {
                        result.push(value);
                    }
                }
            }
            return result;
        })),
    ).subscribe({
        next: val => listenSubject.next(val)
    });
    eventSubject.next({
        coinList,
        keyword
    })
    return observable;
};
export default filterSubject;


