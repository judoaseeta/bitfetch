import * as React from 'react';
import {Subject, from } from 'rxjs';
import { distinctUntilChanged, debounceTime, filter, switchMap, tap, reduce } from 'rxjs/operators';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';

import NavItem from '../components/nav/NavItem';
import SymbolSearch from '../components/nav/SymbolSearch';
import AuthButton from '../components/nav/AuthButton';
import * as styles from './styles/Nav.scss';
import {RootState} from "./index";


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


// Reducers.
export type Props = ReturnType<typeof MapStateToProps> & RouteComponentProps;
export interface State {
    eventSubject: Subject<string>;
    filterKeyword: string;
    filteredCoinList: CoinListData[];
    searching: boolean;
    isUserMenuOn:boolean;
}
const MapStateToProps = (state: RootState) => ({
    coinList: state.main.coinList,
    loaded: state.main.loaded,
});
class Nav extends React.Component<Props, State> {
    state = {
        eventSubject: new Subject<string>(),
        filterKeyword: '',
        filteredCoinList: [],
        isUserMenuOn:false,
        searching: false,
    };
    componentDidMount(): void {
        this.state.eventSubject.pipe(
            tap(d => this.setState({ filterKeyword: d})),
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
                    tap( d =>this.setState({ filteredCoinList: d})),
                );
            }),
        ).subscribe();
    }

    componentDidUpdate(prevProps: Props) {
        const { pathname } = this.props.location;
        const { searching } = this.state;
        if(pathname !== prevProps.location.pathname && searching) {
            this.setState({
                searching: false,
            });
        }
    }
    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        const { coinList, match } = this.props;
        const { filterKeyword, searching, filteredCoinList } = this.state;
        return (
            coinList !== nextProps.coinList)  ||
            (match.params !== nextProps.match.params) ||
            (filteredCoinList !== nextState.filteredCoinList) ||
            (filterKeyword !== nextState.filterKeyword) ||
            (searching !== nextState.searching);
    }
    setFilterKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        if(this.props.coinList) {
            this.state.eventSubject.next(e.target.value);
        }
    };
    setSearching = (e: React.FocusEvent<HTMLInputElement>) => {

        console.log(e.relatedTarget, e.type);
        // if event type is blur then searching will be set to false, searching modal will be disappeared.
        if(e.type === 'blur') {
            // check whether relatedTarget is for preventing false is assigned to 'searching'
            // to navigate where the user wants to go
            if(e.relatedTarget !== null) {
                return;
            }
            this.setState({ searching: false });
        } else if(e.type === 'focus') {
            this.setState({ searching: true });
        }
    };
    render() {
        return (
            <header
                className={styles.container}
            >
                <nav
                    className={styles.navMenu}
                >
                    <ul
                        className={styles.navItems}
                    >
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

export default withRouter(connect(MapStateToProps)(Nav));