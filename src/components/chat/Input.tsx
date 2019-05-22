import * as React from 'react';

import * as styles from './styles/Input.scss';

const Input: React.SFC<{
    message: string
    setMessage: React.ChangeEventHandler<HTMLInputElement>
    publishMessage: React.FormEventHandler<HTMLFormElement>
}> = ({ message, setMessage, publishMessage }) => (
    <form
        className={styles.messageForm}
        onSubmit={publishMessage}
    >
        <input
            className={styles.input}
            value={message}
            onChange={setMessage}
        />
        <input
            className={styles.submit}
            type='submit'
            value='Send'
        />
    </form>
);

export default Input;
