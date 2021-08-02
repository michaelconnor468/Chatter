import React, { useEffect } from 'react';
import config from '../../config';
import Friend from './Friend';
import styles from './FriendsList.module.css';
import Card from '../util/Card';

interface FriendsListProps {}

const FriendsList: React.FC<FriendsListProps> = () => {
    const [inviteList, setInviteList] = React.useState<string[]>([]);
    const [newFriend, setNewFriend] = React.useState<string>('');
    const [friendsList, setFriendsList] = React.useState<string[]>([]);
    const [error, setError] = React.useState<string>('');

    React.useEffect(() => {fetchFriendsList();}, [])

    const fetchFriendsList = async () => {
        const rawResponse = await fetch(`${config.domain}/friends/invites`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const responce = await rawResponse.json();
        if ( rawResponse.ok ) setInviteList(responce.map((query: {User: string}) => query.User));
        else setError(responce.error);

        const rawResponse2 = await fetch(`${config.domain}/friends`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const responce2 = await rawResponse2.json();
        if ( rawResponse2.ok ) setFriendsList(responce2.map((query: {Friend: string}) => query.Friend));
        else setError(responce2.error);
    };

    const acceptInvite = async (friend: string) => {
        const rawResponse = await fetch(`${config.domain}/friends`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: friend})
        });
        if ( rawResponse.ok ) {
            setInviteList(inviteList.filter(invite => invite !== friend ));
            setFriendsList(friendsList.concat([friend]));
            return;
        }
        const responce = await rawResponse.json();
        setError(responce.error);
    };

    const removeFriend = async (friend: string) => {
        const rawResponse = await fetch(`${config.domain}/friends`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: friend})
        });
        if ( rawResponse.ok ) {
            setInviteList(inviteList.filter(invite => invite !== friend ));
            setFriendsList(friendsList.filter(invite => invite !== friend ));
            return;
        }
        const responce = await rawResponse.json();
        setError(responce.error);
    };

    const addFriend = async () => {
        const rawResponse = await fetch(`${config.domain}/friends`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: newFriend})
        });
        setNewFriend('');
        if ( rawResponse.ok ) return;
        const responce = await rawResponse.json();
        setError(responce.error);
    };

    return (
        <Card className={styles.card}>
            {error ? <h1 className={styles.error}>{error}</h1> : <></>}
            {inviteList.map(friend => <Friend key={friend} removeFriend={removeFriend} acceptInvite={acceptInvite} name={friend} invite={true}></Friend>)}
            {friendsList.map(friend => <Friend key={friend} removeFriend={removeFriend} acceptInvite={acceptInvite} name={friend}></Friend>)}
            <Card className={styles.addfriend}>
                <div>
                    <label htmlFor='add-friend'>Add User:</label>
                    <input type='text' id='add-friend' value={newFriend} onChange={(e) => setNewFriend(e.target.value)}></input>
                </div>
                <button onClick={addFriend}>Invite</button></Card>
        </Card>
    );
};

export default FriendsList;