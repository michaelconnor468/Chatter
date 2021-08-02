import React from 'react';
import Login from '../login/Login';
import FriendsList from '../friends/FriendsList'
import { AuthContext } from '../../App';
import styles from './Body.module.css';

interface BodyProps {}

const Body: React.FC<BodyProps> = () => {
    const authContext = React.useContext(AuthContext);

    return (
        <div className={styles.body}>
            { authContext.signedIn ? <FriendsList /> : <Login />}
        </div>
    );
};

export default Body;