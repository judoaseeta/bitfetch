import * as React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
const FaIcon: React.FunctionComponent<{
    className?: string
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    icon: IconProp;
    spin?: boolean;
}> = ({ className, icon, onClick, spin }) => (
    <div
        className={className}
        onClick={onClick}
    >
        <FontAwesomeIcon
            icon={icon}
            spin={spin}
        />
    </div>
);

export default FaIcon;
