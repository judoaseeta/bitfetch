import * as React from 'react';
import { RouteComponentProps, withRouter  } from 'react-router-dom';
import Auth from '@aws-amplify/auth';
import signedApi from '../../utils/apiUtils/signedApi';

type Props = {} & RouteComponentProps<{ username: string }>
type State = {
    code: string;
    error: string;
}
class Confirm extends React.Component<Props, State> {
    state = {
        code: '',
        error: '',
    };
    confirm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { username } = this.props.match.params;
        const { code } = this.state;
        try {
            await Auth.confirmSignUp(username, code);
            // request api to create
            await signedApi({
                endpointName: 'account',
                path: '/create',
                method: 'post',
            });
            this.props.history.replace('/');
        } catch (e) {
            this.setState({
                error: e.message
            })
        }
    };
    onChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ code: e.target.value});
    render() {
        return(
            <form
                onSubmit={this.confirm}
            >
                <h4>Submit your confirmation code sent to </h4>
                <h5>:{this.props.match.params.username}</h5>
                <label
                    htmlFor="code"
                >Code</label>
                <input
                    name="code"
                    onChange={this.onChange}
                />
                {this.state.error ? this.state.error : null}
                <button
                    type="submit"
                >Confirm</button>
            </form>
        )
    }
}

export default withRouter(Confirm);
