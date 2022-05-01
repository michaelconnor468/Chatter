import React from 'react';
import { AuthContext } from '../../App';
import Card from '../util/Card';
import config from '../../config';
import styles from './Chat.module.css';
import FriendsList from '../friends/FriendsList';
import Chat from './Chat';

interface VideoProps { 
    friend: string,
    setBody: React.Dispatch<React.SetStateAction<JSX.Element>>
}

const Video: React.FC<VideoProps> = (props) => {
    const authContext = React.useContext(AuthContext);
    const [isCalling, setIsCalling] = React.useState(true);

    return (
        <Card className={styles.chat}>
            <div className={styles.header}>
                <h1>{(isCalling ? "Calling " : "") + props.friend}</h1> 
                <button onClick={() => {props.setBody(<Chat friend={props.friend} setBody={props.setBody} />);}}>Close</button>
            </div>
        </Card>
    );
};

export default Video;
