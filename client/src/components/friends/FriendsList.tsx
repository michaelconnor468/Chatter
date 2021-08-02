import React, { useEffect } from 'react';
import config from '../../config';
import Friend from './Friend';
import styles from './FriendsList.module.css';
import Card from '../util/Card';

interface FriendsListProps {}

const FriendsList: React.FC<FriendsListProps> = () => {
    const friendsList = [];

    return (
        <Card className={styles.card}>
            <Friend name='test'></Friend>
            <Card className={styles.addfriend}><h1>+ Add Friend</h1></Card>
        </Card>
    );
};

export default FriendsList;