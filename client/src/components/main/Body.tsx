import React from 'react';
import Login from '../login/Login';
import FriendsList from '../friends/FriendsList'
import { AuthContext } from '../../App';
import styles from './Body.module.css';

interface BodyProps {}

const Body: React.FC<BodyProps> = () => {
    const authContext = React.useContext(AuthContext);
    const [body, setBody] = React.useState(<></>);
    React.useEffect(() => {
        setBody(authContext.signedIn ? <FriendsList setBody={setBody} /> : <Login />);
    }, [authContext]);

    return (
        <div className={styles.body}>
            {body}
        </div>
    );
};

export default Body;