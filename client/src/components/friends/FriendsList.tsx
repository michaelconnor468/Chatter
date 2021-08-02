import React from 'react';
import Friend from './Friend';
import styles from './FriendsList.module.css';
import Card from '../util/Card';

interface FriendsListProps {}

const FriendsList: React.FC<FriendsListProps> = () => {
    const [login, setLogin] = React.useState(true);

    return (
        <Card className={styles.card}>
            <Friend name='test'></Friend>
            <Card className={styles.addfriend}><h1>+ Add Friend</h1></Card>
        </Card>
    );
};

export default FriendsList;