import * as React from 'react';
import { Types, Realtime, Rest } from 'ably';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import { RootState } from './';
import getUser from '../utils/getUser';

const mapStateToProps = (state: RootState) => ({

});
export type RenderProps = Chat.State & {
    setMessage: React.ChangeEventHandler<HTMLInputElement>,
    publishMessage: React.FocusEventHandler<HTMLFormElement>
};
export declare namespace Chat {

    export type Props = {
        children: (rProps: RenderProps) => JSX.Element;
    } & ReturnType<typeof mapStateToProps>&  RouteComponentProps<{
        fsym: string;
    }>;
    export type State = {
        ably?: Types.RealtimeChannel,
        message: string;
        messages: Types.Message[];
        rest: Rest;
        lastToken?: Types.TokenDetails
    }
}
class Chat extends React.Component<Chat.Props,Chat.State> {
    state: Chat.State = {
        message: '',
        messages: [],
        rest: new Rest('zzVfAew.uzriRg:iAEOt7XFSO-JeKig'),
    };
    async componentDidMount() {
        const { fsym } = this.props.match.params;
        await this.initChat(fsym);
    };
    componentWillUnmount() {
        this.unsubscribe();
    };
    authAndSubscribe =  async (channelName: string) => {
        try {
            const authInfo = await getUser();
            let tokenParams: NonNullable<Types.TokenParams>;
            let lastToken: Types.TokenDetails | undefined = undefined;
            if(!authInfo) {
                // when user is not login, give user random guest id.
                tokenParams = {
                    clientId: `guest${Math.floor(Math.random() * 10)}`,
                    capability: JSON.stringify({
                        [`chat:${channelName}`]: ["subscribe"]
                    }),
                };
                console.log(tokenParams);
                lastToken = await this.requestToken(tokenParams);
            } else if(!!authInfo) {
                // when user is logged in.
                tokenParams = {
                    clientId: authInfo.name,
                    capability: JSON.stringify({
                        [`chat:${channelName}`]: ["subscribe","publish"]
                    }),
                };
                console.log(tokenParams);
                lastToken = await this.requestToken(tokenParams);
            }
            if(lastToken) {
                this.subscribe(channelName, lastToken);
            }
        } catch(e) {
            throw new Error(e);
        }
    };
    initChat = async (channelName: string) => {
        try {
            if(!this.state.lastToken || this.validateToken() === false) await this.authAndSubscribe(channelName);
        } catch(e) {
            console.log(e);
        }
    };
    setMessage = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ message: e.currentTarget.value });
    publishMessage = (e: React.FormEvent<HTMLFormElement>) => {
        const { ably,message } = this.state;
        if(ably && message) ably.publish(message);
    };
    requestToken = (tokenParams: Types.TokenParams) => new Promise<Types.TokenDetails>((res, rej ) => {
        this.state.rest.auth.requestToken(tokenParams, (err, token) => {
            if(err) rej(err);
            res(token);
        })
    });
    subscribe = (channelName: string, token: Types.TokenDetails) => {
        const realtime = new Realtime({token: token});
        realtime.connection.on('connected', () => {
            this.setState({
                ably: realtime!.channels.get(channelName),
                lastToken: token
            },() => {
                this.state.ably!.subscribe(msg => {
                    this.setState({
                        messages: [...this.state.messages, msg]
                    })
                });
            });
        });
    };
    unsubscribe = () => {
        if(this.state.ably) this.state.ably.unsubscribe();
    };
    validateToken = () => {
        const { lastToken } = this.state;
        if(!lastToken) return false;
        else if(lastToken && lastToken.expires > lastToken.issued) return true;
        return false;
    };
    render() {
        return (
            this.props.children({
                ...this.state,
                setMessage: this.setMessage,
                publishMessage: this.publishMessage
            }))
    }
    }

export default withRouter(connect(mapStateToProps)(Chat));
