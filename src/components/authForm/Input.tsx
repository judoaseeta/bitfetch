import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { bind } from 'classnames/bind';
import * as styles from './styles/Input.scss';
import AuthIcon from './AuthIcon';
export enum AuthInputType {
    email = 'email',
    password = 'password',
    name = 'name',
}
const cx = bind(styles);
const Input: React.SFC<{
    errorMessage?: string;
    onChange : React.ChangeEventHandler<HTMLInputElement>;
    name: AuthInputType;
    placeholder: string;
    value: string;
    validated?: boolean;
    type?: string
} & RouteComponentProps<{ authType: string}>> =
    ({ errorMessage, onChange, name, placeholder, value, type, validated, match: { params: { authType}} }) => (
    <div
        className={cx('inputContainer', {
            error: !!errorMessage,
            validated: validated
        })}
    >
        <div
            className={cx('inputInner')}
        >
        <AuthIcon
            isValidated={validated!}
            isError={!!errorMessage}
            type={name}
        />
        <input
            autoComplete={authType === 'signin' ? type === "email" ? "username": "current-password": ""}
            className={cx('input', {
                error: !!errorMessage,
                validated: validated
            })}
            onChange={onChange}
            name={name}
            id={name}
            placeholder={placeholder}
            value={value}
            type={type}
        />
        </div>
        <div
            className={styles.message}
        >{errorMessage}</div>
    </div>
);

export default withRouter(Input);