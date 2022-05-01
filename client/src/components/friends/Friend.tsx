import React from 'react';
import styles from './Friend.module.css';
import Card from '../util/Card';

interface FriendProps {
    name: string,
    invite?: boolean,
    removeFriend: (friend: string) => Promise<void>,
    acceptInvite: (friend: string) => Promise<void>,
    onClick?: () => void
}

const Friend: React.FC<FriendProps> = (props) => {
    const [login, setLogin] = React.useState(true);

    return (
        <Card className={styles.friend} onClick={props.onClick || undefined}>
            <h1>{props.name}</h1>
            <div className={styles.buttons}>
                {props.invite ? <button onClick={() => props.acceptInvite(props.name)}>Accept</button> : <></>}
                <button onClick={(e) => {props.removeFriend(props.name); e.stopPropagation();}}>Remove</button>
            </div>
        </Card>
    );
};

export default Friend;
