import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import {bindActionCreators, Dispatch  } from 'redux';

import * as styles from './styles/AuthForm.scss';
import { emailRegex, validatePw } from '../utils/regexes';

import {RootState} from "./index";
import { authActions } from './App';
import Input from '../components/authForm/Input';
import Label from '../components/authForm/AuthLabel';
import LazyImage from '../utils/LazyImage';

const mapStateToProps = (state: RootState) => ({ auth: state.main.auth});
const mapDispatchToProps = (dispatch: Dispatch) => ({
    ...bindActionCreators({...authActions}, dispatch)
});
enum AuthInputType {
    email = 'email',
    password = 'password',
    name = 'name',
}
type Props = {} & ReturnType<typeof mapStateToProps>
    & ReturnType<typeof mapDispatchToProps>
    & RouteComponentProps<{ type: string }>;
type State = {
    email: string;
    password: string;
    emailError: string;
    passwordError: string;
    emailValidated: boolean;
    passwordValidated: boolean;
    name: string;
}
class AuthForm extends React.Component<Props, State> {
    state = {
        email: '',
        password: '',
        emailError: '',
        passwordError: '',
        emailValidated: false,
        passwordValidated: false,
        name: '',
    };
    componentDidUpdate(prevProps: Props) {
        const { authError, isSignIn, isSignUp } = this.props.auth;
        if(prevProps.auth.authError !== authError) {
           this.redirecter(authError);
        }
        if(isSignIn) this.redirecter('signIn');
        if(isSignUp) this.redirecter('success');
    }
    validateRegex = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if(name === 'email') {
            if(value.length === 0) return '';
            if(!emailRegex(value)) return 'it should be valid e-mail address';
            else return 'valid';
        } else if (name === 'password') {
            return validatePw(value);
        }
        return '';
    };
    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if(value === '' ) {
            if(name === 'email') this.setState({ email: value , emailError: ''})
            else if(name === 'password') this.setState({ password: value, passwordError: ''})
        }
        if(name === 'email') {
            const checkEmail = this.validateRegex(e);
            this.setState({
                email: value,
                emailError :  checkEmail === 'valid' ? '' : checkEmail,
                emailValidated: checkEmail === 'valid' ? true : this.state.emailValidated,
            })
        } else if(name === 'password'){
            this.setState({
                password: value,
                passwordError: this.validateRegex(e),
            })
        } else {
            this.setState({
                name: value
            })
        }
    };
    onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const { type } = this.props.match.params;
        const { email, password, name } = this.state;
        e.preventDefault();
        if(type === 'signup') this.props.SIGN_UP({ username: email, name, password });
        else this.props.SIGN_IN({ username: email, password});
    };
    // common method for each authenticate situation.
    redirecter = (type: string) => {
        const { replace } = this.props.history;
        const { email } = this.state;
        console.log(type);
        if(type === 'UserNotConfirmedException') replace(`/confirm/${email}`);
        else if(type === 'success') {
            if(this.props.history.length > 1) {
                replace(`/confirm/${email}`);
            }
        }
        else if (type === 'signIn') {
             replace('/');
        }
    };
    render() {
        const { email, emailError, emailValidated, password, passwordError, name } = this.state;
        const { type } = this.props.match.params;
        return (
            <div
                className={styles.container}
            >
                <LazyImage
                    className={styles.bgImage}
                    previewSrc={'https://res.cloudinary.com/debzuxx1d/image/upload/w_50,c_scale/v1563119494/stock-1863880_1920_dmkkx6.jpg'}
                    src={'https://res.cloudinary.com/debzuxx1d/image/upload/v1563119494/stock-1863880_1920_dmkkx6.jpg'}
                />
                <form
                    className={styles.form}
                    onSubmit={this.onSubmit}
                >
                    <Label htmlFor='email'>Email</Label>
                    <Input
                        name={AuthInputType.email}
                        onChange={this.onChange}
                        errorMessage={emailError}
                        value={email}
                        validated={emailValidated}
                        placeholder='email'
                    />
                    {
                        type === 'signup' ?
                            <>
                                <Label htmlFor='name'>Username</Label>
                                <Input
                                    name={AuthInputType.name}
                                    onChange={this.onChange}
                                    value={name}
                                    placeholder='username'
                                />
                            </>
                            : null
                    }
                    <Label htmlFor='password'>Password</Label>
                    <Input
                        name={AuthInputType.password}
                        onChange={this.onChange}
                        errorMessage={passwordError}
                        value={password}
                        placeholder='*********'
                        validated={password.length > 8 && !passwordError}
                        type='password'
                    />
                    <button type='submit'>submit</button>
                </form>
            </div>
        );
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthForm));
