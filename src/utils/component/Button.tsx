import * as React from 'react';

const Button: React.FunctionComponent<{
    className?: string;
    disabled?: boolean;
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ className, disabled, children, onClick }) => (
    <button
        className={className}
        disabled={disabled}
        onClick={onClick}
    >{children}</button>
);

export default Button;