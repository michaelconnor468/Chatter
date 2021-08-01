import React from 'react';
import Login from '../login/Login';
import FriendsList from '../friends/FriendsList'
import { AuthContext } from '../../App';
import styles from './Body.module.css';

interface BodyProps {}

const Body: React.FC<BodyProps> = () => {
    const jwt = React.useContext(AuthContext)?.jwt;

    return (
        <div className={styles.body}>
            { (jwt?.username != '' && jwt?.hash != '') ? <FriendsList /> : <Login />}
        </div>
    );
};

export default Body;