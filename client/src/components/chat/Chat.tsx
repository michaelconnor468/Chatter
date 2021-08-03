import { prependOnceListener } from 'process';
import React from 'react';
import Card from '../util/Card';
import styles from './Chat.module.css';

interface ChatProps { friend: string }

const Chat: React.FC<ChatProps> = (props) => {
    return (
        <Card className={styles.chat}>
            <h1>{props.friend}</h1>
            <hr />
            <div className={styles.content}>

            </div>
            <div className={styles.input}><input type='text'></input><button>Send</button></div>
        </Card>
    );
};

export default Chat;