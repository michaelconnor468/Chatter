import React, { useEffect } from 'react';
import config from '../../config';
import Friend from './Friend';
import styles from './FriendsList.module.css';
import Card from '../util/Card';
import Chat from '../chat/Chat';

interface FriendsListProps {
    setBody: React.Dispatch<React.SetStateAction<JSX.Element>>
}

const FriendsList: React.FC<FriendsListProps> = (props) => {
    const [inviteList, setInviteList] = React.useState<string[]>([]);
    const [newFriend, setNewFriend] = React.useState<string>('');
    const [friendsList, setFriendsList] = React.useState<string[]>([]);
    const [callList, setCallList] = React.useState<string[]>([]);
    const [error, setError] = React.useState<string>('');

    React.useEffect(() => {
        fetchFriendsList();
    }, []);

    const fetchFriendsList = async () => {
        const invites = await fetch(`${config.domain}/friends/invites`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const invitesJSON = await invites.json();
        if ( invites.ok ) setInviteList(invitesJSON.map((query: {User: string}) => query.User));
        else setError(invitesJSON.error);

        const friendListResponse = await fetch(`${config.domain}/friends`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const friendListResponseJSON = await friendListResponse.json();
        if ( friendListResponse.ok ) 
            setFriendsList(friendListResponseJSON.map((query: {Friend: string}) => query.Friend));
        else setError(friendListResponseJSON.error);
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
    
    const acceptCall = async (friend: string, offer: string) => {
        props.setBody(<Video rtc_offer={offer} friend={props.friend} setBody={props.setBody} />);
        const rawResponse = await fetch(`${config.domain}/webrtc`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({owner: friend, method: 'answer'})
        });
    }

    return (
        <Card className={styles.card}>
            {error ? <h1 className={styles.error}>{error}</h1> : <></>}
            {inviteList.map(friend => <Friend key={friend} acceptCall={acceptCall} removeFriend={removeFriend} acceptInvite={acceptInvite} name={friend} invite={true}></Friend>)}
            {friendsList.map(friend => <Friend key={friend} removeFriend={removeFriend} acceptInvite={acceptInvite} name={friend} onClick={() => props.setBody(<Chat friend={friend} setBody={props.setBody} />)}></Friend>)}
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
