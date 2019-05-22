import * as React from 'react';
import { RenderProps } from '../../containers/Chat';
import Input from './Input';
import Message from './Message';
import * as styles from './styles/ChatCompo.scss';
const ChatCompo:React.SFC<RenderProps> = ( { messages, message, setMessage, publishMessage }) => (
    <div
        className={styles.chatCompo}
    >
        {messages.map( msg => <Message
            key={msg.id}
            message={msg}
        />
        )}
        <Input
            message={message}
            setMessage={setMessage}
            publishMessage={publishMessage}
        />
    </div>
);

export default ChatCompo;
