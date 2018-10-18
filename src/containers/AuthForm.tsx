import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as styles from './styles/AuthForm.scss';
import { emailRegex, validatePw } from '../utils/regexes';
type Props = {

} & RouteComponentProps<{ type: string }>;
type State = {
    email: string;
    password: string;
    emailError: string;
    passwordError: string;
}
class AuthForm extends React.Component<Props, State> {
    state = {
        email: '',
        password: '',
        emailError: '',
        passwordError: '',
    };
    authType = () =>  {
        const { type } = this.props.match.params;
        if(type === 'signin') return 'Sign In';
        else return 'Sign Up';
    };
    validateRegex = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        if(name === 'email' && !emailRegex.test(e.target.value)) {
            return 'it should be valid e-mail address';
        } else if (name === 'password') {
            return validatePw(e.target.value);
        }
        return '';
    };
    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        if(name === 'email') {
            this.setState({
                email: e.target.value,
                emailError : this.validateRegex(e),
            })
        } else {
            this.setState({
                password: e.target.value,
                passwordError: this.validateRegex(e),
            })
        }
    };
    onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(this.state.email, this.state.password);
    };
    render() {
        return (
            <form
                className={styles.form}
                onSubmit={this.onSubmit}
            >
                <label
                    htmlFor="email"
                >E-mail</label>
                <input
                    name="email"
                    onChange={this.onChange}
                />
                <label
                    htmlFor='username'
                >Username</label>
                <input
                    name='username'
                />
                <label
                    htmlFor="password"
                >
                    Password
                </label>
                <input
                    name="password"
                    onChange={this.onChange}
                />
                <div
                    className={styles.buttonHolder}
                >
                    <button
                        formAction="submit"
                    >{this.authType()}</button>
                </div>
            </form>
        );
    }
}
export default withRouter(AuthForm);
