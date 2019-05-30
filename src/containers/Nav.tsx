import * as React from 'react';
import { Subject } from 'rxjs';
import {map, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import NavItem from '../components/nav/NavItem';
import SymbolSearch from '../components/nav/SymbolSearch';
import AuthButton from '../components/nav/AuthButton';
import * as styles from './styles/Nav.scss';

const NavItems = [
    {
        name: 'Home',
        to: '/'
    },
    {
        name: 'Market',
        to: '/market'
    }
];

export type Props = {
    coinList: any[];
    loaded: boolean;
} & RouteComponentProps;
export interface State {
    eventSubject: Subject<string>;
    filteredCoinList: any[];
    filterKeyword: string;
    searching: boolean;
    isUserMenuOn:boolean;
}
class Nav extends React.Component<Props, State> {
    state = {
        eventSubject: new Subject<string>(),
        filteredCoinList: [],
        filterKeyword: '',
        isUserMenuOn:false,
        searching: false,
    };
    componentDidMount() {
        this.state.eventSubject.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map((d => {
                let replacedString = d.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
                if(replacedString === '') {
                    return [];
                }
                let result = [];
                let regex = new RegExp(replacedString, 'i');
                for (let [key, value] of this.props.coinList) {
                    if (key.match(regex)) {
                        result.push(value);
                    }
                }
                return result;
            }))
        ).subscribe({
            next: val => this.setState({
                filteredCoinList: val,
            })
        });
    }
    componentDidUpdate() {
        console.log(this.state);
    }
    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        const { coinList, match } = this.props;
        const { filteredCoinList, filterKeyword } = this.state;
        return (coinList !== nextProps.coinList)  || (match.params !== nextProps.match.params) || (filteredCoinList !== nextState.filteredCoinList) || (filterKeyword !== nextState.filterKeyword);
    }
    setFilterKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        this.setState({
            filterKeyword: e.target.value,
        }, () => this.state.eventSubject.next(e.target.value));
    };
    setSearching = (e: React.FocusEvent<HTMLInputElement>) => {
        this.setState((prev) => ({ searching: !prev.searching}))
    };
    render() {
        return (
            <header
                className={styles.container}
            >
                <nav>
                    <ul>
                        {NavItems.map(item =>
                            <NavItem
                                key={item.name}
                                name={item.name}
                                to={item.to}
                            />)}
                    </ul>
                    <SymbolSearch
                        searching={this.state.searching}
                        setFilterKeyword={this.setFilterKeyword}
                        setSearching={this.setSearching}
                        filteredCoinList={this.state.filteredCoinList}
                        filterKeyword={this.state.filterKeyword}
                        loaded={this.props.loaded}
                    />
                </nav>
                <AuthButton/>
            </header>
        );
    }
}

export default withRouter(Nav);