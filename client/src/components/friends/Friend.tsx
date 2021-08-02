import React from 'react';
import styles from './Friend.module.css';
import Card from '../util/Card';

interface FriendProps {
    name: string,
    invite?: boolean
}

const Friend: React.FC<FriendProps> = (props) => {
    const [login, setLogin] = React.useState(true);

    return (
        <Card className={styles.friend}>
            <h1>{props.name}</h1>
            <div className={styles.buttons}>
                {props.invite ? <button>Accept</button> : <></>}
                <button>Remove</button>
            </div>
        </Card>
    );
};

export default Friend;