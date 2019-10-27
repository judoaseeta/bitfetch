import * as React from 'react';
import { faEnvelope, faTimesCircle, faCheckCircle, faShieldAlt,faUserTag } from '@fortawesome/free-solid-svg-icons';
import { bind } from 'classnames/bind';
import { AuthInputType } from './Input';
import FaIcon from '../../utils/component/faIcon';
import * as styles from './styles/AuthIcon.scss';

const cx = bind(styles);
const AuthIcon: React.FunctionComponent<{
    isError: boolean;
    isValidated: boolean;
    type: AuthInputType;
}> = ({ isError, isValidated, type, }) => {
    if(isError) {
        return <FaIcon
                className={cx('authIcon', {
                    error: isError,
                    validated: isValidated,
                })}
                icon={faTimesCircle}
               />
    } else if (isValidated) {
        return <FaIcon
                className={cx('authIcon', {
                    error: isError,
                    validated: isValidated,
                })}
                icon={faCheckCircle}
            />;
    }
    if(type === AuthInputType.name) {
        return <FaIcon
            className={cx('name', {
                error: isError,
                validated: isValidated,
            })}
            icon={faUserTag}
        />;
    } else if (type === AuthInputType.password) {
        return <FaIcon
            className={cx('authIcon', {
                error: isError,
                validated: isValidated,
            })}
            icon={faShieldAlt}
        />;
    }
    return  <FaIcon
        className={cx('authIcon', {
            error: isError,
            validated: isValidated,
        })}
        icon={faEnvelope}
    />;
};

export default AuthIcon;
