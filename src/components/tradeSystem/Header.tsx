import * as React from 'react';

const Header: React.SFC<{
    fsym: string;
}> = ({ fsym }) => (
    <header>{fsym}</header>
);

export default Header;