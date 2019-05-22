import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { bind } from 'classnames/bind';
import { AuthInputType } from './Input';
import * as styles from './styles/AuthIcon.scss';

const cx = bind(styles);
const AuthIcon: React.SFC<{
    isError: boolean;
    isValidated: boolean;
    type: AuthInputType;
}> = ({ isError, isValidated, type, }) => {
    if(isError) {
        return <FontAwesomeIcon
                    className={cx('authIcon', {
                        error: isError,
                        validated: isValidated,
                    })}
                    icon={['fas', 'times-circle']}
                />
    } else if (isValidated) {
        return <FontAwesomeIcon
                    className={cx('authIcon', {
                        error: isError,
                        validated: isValidated,
                    })}
                    icon={['fas', 'check-circle']}
                />
    }
    if(type === AuthInputType.name) {
        return <FontAwesomeIcon
                    className={cx('name', {
                        error: isError,
                        validated: isValidated,
                    })}
                    icon={['fas', 'user-tag']} style={{  fontSize: '17px'}}
                />
    } else if (type === AuthInputType.password) {
        return <FontAwesomeIcon
                    className={cx('authIcon', {
                        error: isError,
                        validated: isValidated,
                    })}
                    icon={['fas', 'shield-alt']}
                />
    }
    return <FontAwesomeIcon
                className={cx('authIcon', {
                    error: isError,
                    validated: isValidated,
                })}
                icon={['fas', 'envelope']}
        />
};

export default AuthIcon;
