import React from 'react';
import config from '../../config';
import styles from './Friend.module.css';
import Card from '../util/Card';
import { AuthContext } from '../../App';

interface FriendProps {
    name: string,
    invite?: boolean,
    removeFriend: (friend: string) => Promise<void>,
    acceptInvite: (friend: string) => Promise<void>,
    acceptCall?: (friend: string, offer: string | null) => Promise<void>,
    onClick?: () => void
}

const Friend: React.FC<FriendProps> = (props) => {
    const authContext = React.useContext(AuthContext);
    const [login, setLogin] = React.useState(true);
    const [calling, setCalling] = React.useState(false);
    let webrtc_offer: string | null = null;

    const fetchCalls = (caller: string) => {
        // TODO
    }

    React.useEffect(() => {
        fetchCalls(props.name);
        authContext.socket.on('video-call', (caller: string) => {
            if (caller === props.name) setCalling(true); 
        });
        authContext.socket.on('video-hangup', (caller: string) => {
            if (caller === props.name) setCalling(false);
        });
    }, []);
    
    const declineCall = async (friend: string) => {
        const rawResponse = await fetch(`${config.domain}/webrtc`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({owner: friend})
        });
    }

    return (
        <Card className={styles.friend} onClick={props.onClick || undefined}>
            <h1>{props.name}</h1>
            <div className={styles.buttons}>
                {props.invite ? <button onClick={() => props.acceptInvite(props.name)}>Accept</button> : <></>}
                {calling ? <><img onClick={() => props.acceptCall ? props.acceptCall(props.name, webrtc_offer) : ''} src='resources/answer.png'></img>
                    <img onClick={() => declineCall(props.name)} src='resources/hangup.png'></img></> : <></>}
                <button onClick={(e) => {props.removeFriend(props.name); e.stopPropagation();}}>Remove</button>
            </div>
        </Card>
    );
};

export default Friend;
