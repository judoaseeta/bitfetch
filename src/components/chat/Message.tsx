import * as React from 'react';
import { Types } from 'ably';

import * as styles from './styles/Message.scss';

const Message: React.SFC<{
    message: Types.Message
}> = ({ message }) => (
    <span
        className={styles.message}
    ><h5>{message.name}</h5><p>{message.data}</p> - <p>{message.timestamp}</p></span>
);

export default Message;
