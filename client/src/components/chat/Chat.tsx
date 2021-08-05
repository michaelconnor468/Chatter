import React from 'react';
import { AuthContext } from '../../App';
import Card from '../util/Card';
import config from '../../config';
import styles from './Chat.module.css';
import FriendsList from '../friends/FriendsList';
import { response } from 'express';

interface ChatProps { 
    friend: string,
    setBody: React.Dispatch<React.SetStateAction<JSX.Element>>
}

interface Message {
    Sender: string,
    Receiver: string,
    Message: string,
    Time: Date
}

const Chat: React.FC<ChatProps> = (props) => {
    const [message, setMessage] = React.useState('');
    const [messages, setMessages] = React.useState<Message[]>([]);

    const authContext = React.useContext(AuthContext);

    const getMessages = async () => {
        const rawResponse = await fetch(`${config.domain}/messages?friend=${props.friend}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if ( rawResponse.ok ) setMessages((await rawResponse.json()).map((msg: Message) => {return {...msg, Time: new Date(msg.Time)};}));
    };

    React.useEffect(() => {
        getMessages();
        authContext.socket.on('message', (message: Message) => setMessages(messages => [...messages, {Sender: message.Sender, Receiver: message.Receiver, Message: message.Message, Time: new Date()}]));
    }, []);

    const sendMessage = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const rawResponse = await fetch(`${config.domain}/messages`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({friend: props.friend, message: message})
        });
        if ( rawResponse.ok ) setMessages(messages => [...messages, {Sender: authContext.signedIn, Receiver: props.friend, Message: message, Time: new Date()}]);
        setMessage('');
    };

    return (
        <Card className={styles.chat}>
            <div className={styles.header}><h1>{props.friend}</h1> <button onClick={() => {authContext.socket.off('message'); props.setBody(<FriendsList setBody={props.setBody} />);}}>Close</button></div>
            <hr />
            <div className={styles.content}>
                {messages
                    .sort((a, b) => (a.Time.getTime() - b.Time.getTime()))
                    .map(message => 
                        <p className={message.Sender === authContext.signedIn ? styles.primarymessage : styles.secondarymessage}>{message.Message}</p>
                    )}
            </div>
            <form className={styles.input} onSubmit={e => sendMessage(e)}><input type='text' value={message} onChange={(e) => setMessage(e.target.value.substring(0, Math.min(e.target.value.length, 140)))}></input><button onClick={e => sendMessage(e)}>Send</button></form>
        </Card>
    );
};

export default Chat;