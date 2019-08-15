import * as React from 'react';

const FaIcon: React.FunctionComponent<{
    className?: string
    faType: 'fab' | 'fas',
    icon: string;
}> = ({ className, faType = 'fas', icon }) => (
    <span
        className={className}
    >
        <i
            className={`${faType} ${icon}`}
        />
    </span>
);

export default FaIcon;
