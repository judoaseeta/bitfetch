import * as React from 'react';
import { connect } from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import { RootState } from './';
import {from, Subject} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map, reduce, switchMap, tap} from 'rxjs/operators';

import ExtendSearchCompo from '../components/extendSearch/ExtendSearch';

//entity
import CoinListData from '../core/lib/entities/coinListData';

const MapStateToProps = (state: RootState) => ({
    coinList: state.coinList.coinList,
    isLoaded: state.coinList.loaded
});
type Props = RouteComponentProps<{
    fsym: string
}> & ReturnType<typeof MapStateToProps>;
type State = {
    searchedCoinList: CoinListData[];
    eventSubject: Subject<string>;
};
class ExtendSearch extends React.Component<Props, State> {
    state = {
        searchedCoinList: [],
        eventSubject: new Subject<string>()
    };
    componentDidMount(){
        const { isLoaded  } = this.props;
        this.state.eventSubject.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(d => {
                const upperCasedKeyword = d.toUpperCase();
                // to replace any unnecessary characters such as -[]{}()*+?.,\^.
                let replacedString = d.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
                if(replacedString === '') {
                    return [];
                }
                let regex = new RegExp(replacedString, 'i');
                return from(this.props.coinList!).pipe(
                    filter(item => regex.test(item[0])),
                    reduce((acc,curr)=> {
                        if(curr[0] === upperCasedKeyword) {
                            return [curr[1], ...acc];
                        }
                        return [...acc,curr[1]];
                    },[] as CoinListData[]),
                    tap( d =>this.setState({ searchedCoinList: d})),
                );
            }),
        ).subscribe();
        // when component is mounted && coinlist data is loaded
        if(isLoaded) {
            this.filterList();
        }
    };
    componentDidUpdate(prevProps: Props, prevState: Readonly<State>, snapshot?: any): void {
        const { isLoaded, match: {params: {fsym}} } = this.props;
        const { isLoaded : prevLoaded, match:{ params: {fsym : prevFsym}}} = prevProps;
        if(prevLoaded !== isLoaded) this.filterList();
        if(prevFsym !== fsym) this.filterList();
    }

    filterList() {
        const { eventSubject } = this.state;
        const { match: {params: {fsym}}} = this.props;
        eventSubject.next(fsym);
    }
    render() {
        return(
            <ExtendSearchCompo
                filteredCoinList={this.state.searchedCoinList}
            />
        );
    }
}

export default withRouter(connect(MapStateToProps)(ExtendSearch));
