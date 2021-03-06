import React from 'react';
import ReactDOM from 'react-dom';
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
    const webcam_ref = React.useRef<HTMLVideoElement>(null);
    const remote_ref = React.useRef<HTMLVideoElement>(null);

    const setupRTC = async () => {
        const stun_servers = {
          iceServers: [{urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']},],
          iceCandidatePoolSize: 10,
        };
        const rtc = new RTCPeerConnection(stun_servers);
        const local_stream = await navigator.mediaDevices.getUserMedia({video:true, audio: true});
        const remote_stream = new MediaStream();

        local_stream.getTracks().forEach((track) => rtc.addTrack(track, local_stream));
        rtc.ontrack = (event) => event.streams[0].getTracks().forEach((track) => remote_stream.addTrack(track));
        const webcam_video = ReactDOM.findDOMNode(webcam_ref.current) as HTMLVideoElement;
        const remote_video = ReactDOM.findDOMNode(remote_ref.current) as HTMLVideoElement;
        if ( webcam_video != null && remote_video != null ) {
            webcam_video.srcObject = local_stream;
            remote_video.srcObject = remote_stream;
        }
    }

    return (
        <Card className={styles.chat}>
            <div className={styles.header}>
                <h1>{(isCalling ? "Calling " : "") + props.friend}</h1> 
                <button onClick={() => {props.setBody(<Chat friend={props.friend} setBody={props.setBody} />);}}>Close</button>
            </div>
            <div className={styles.webcams}>
                <video id="local_cam" ref={webcam_ref}></video>
                <video id="remote_cam" ref={remote_ref}></video>
            </div>
        </Card>
    );
};

export default Video;
