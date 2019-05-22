import * as React from 'react';
import { Subject } from 'rxjs';
import {map, distinctUntilChanged, debounceTime } from 'rxjs/operators';

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
declare namespace Nav {
    export type Props = {
        coinList: any[];
        loaded: boolean;
    }
    export interface State {
        eventSubject: Subject<string>;
        filteredCoinList: any[];
        filterKeyword: string;
        searching: boolean;
        isUserMenuOn:boolean;
    }
}
class Nav extends React.Component<Nav.Props, Nav.State> {
    state = {
        eventSubject: new Subject<string>(),
        filteredCoinList: [],
        filterKeyword: '',
        isUserMenuOn:false,
        searching: false,
    };
    componentDidMount() {
        console.log(this.props);
        this.state.eventSubject.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map((d => {
                if(d === '') {
                    return [];
                }
                let result = [];
                let regex = new RegExp(d, 'i');
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

export default Nav;