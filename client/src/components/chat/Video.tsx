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
    rtc_offer?: string,
    setBody: React.Dispatch<React.SetStateAction<JSX.Element>>
}

const Video: React.FC<VideoProps> = (props) => {
    const authContext = React.useContext(AuthContext);
    const [isCalling, setIsCalling] = React.useState(!props.rtc_offer);
    const webcam_ref = React.useRef<HTMLVideoElement>(null);
    const remote_ref = React.useRef<HTMLVideoElement>(null);
    const stun_servers = {
      iceServers: [{urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']}],
      iceCandidatePoolSize: 10,
    };
    const rtc = new RTCPeerConnection(stun_servers);
    let offer : string;

    React.useEffect(() => {
        if ( props.rtc_offer ) {
            initializeMedia();
            acceptRTC(props.rtc_offer);
            return;
        }
        initializeMedia();
        initiateRTC();
    }, [])

    const initializeMedia = async () => {
        const local_stream = await navigator.mediaDevices.getUserMedia({video:true, audio: true});
        const remote_stream = new MediaStream();

        const webcam_video = ReactDOM.findDOMNode(webcam_ref.current) as HTMLVideoElement;
        const remote_video = ReactDOM.findDOMNode(remote_ref.current) as HTMLVideoElement;

        local_stream.getTracks().forEach((track) => rtc.addTrack(track, local_stream));
        rtc.ontrack = (event) => event.streams[0].getTracks().forEach((track) => {
            const [remoteStream] = event.streams;
            remote_video.srcObject = remoteStream;
        });
        webcam_video.srcObject = local_stream;
        rtc.addEventListener('connectionstatechange', event => {
            if (rtc.connectionState === 'connected') {
                console.log('WebRTC Connected');
            }
        });
    }

    const initiateRTC = async () => {
        authContext.socket.on('video-answer', async (data) => {
            const remote_description = new RTCSessionDescription(data.answer);
            await rtc.setRemoteDescription(remote_description);
            rtc.addEventListener('icecandidate', (event) => {
                if ( event.candidate ) {
                    fetch(`${config.domain}/webrtc/ice`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ice: event.candidate, username: props.friend})
                    });
                }
            });
        });
        authContext.socket.on('video-ice', async (data) => {
            try {
                await rtc.addIceCandidate(data.ice);
            } catch (e) {
                console.log('Failed to get ice candidate', e);
            }
        });
        authContext.socket.on('video-hangup', (data) => {
            props.setBody(<Chat friend={props.friend} setBody={props.setBody} />);
        });

        const offer = await rtc.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true});
        await rtc.setLocalDescription(offer);

        const rawResponse = await fetch(`${config.domain}/webrtc`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({offer: offer, username: props.friend})
        });
    }

    const terminateRTC = async () => {
        const rawResponse = await fetch(`${config.domain}/webrtc`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: props.friend, method: 'hangup'})
        });
        props.setBody(<Chat friend={props.friend} setBody={props.setBody} />);
    }

    const acceptRTC = async (offer: string) => {
        await rtc.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));
        const answer = await rtc.createAnswer();
        await rtc.setLocalDescription(answer);
        const rawResponse = await fetch(`${config.domain}/webrtc`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: props.friend, method: 'answer', answer: answer})
        });
        authContext.socket.on('video-ice', async (data) => {
            try {
                await rtc.addIceCandidate(data.ice);
            } catch (e) {
                console.log('Failed to get ice candidate', e);
            }
        });
        rtc.addEventListener('icecandidate', (event) => {
            if ( event.candidate ) {
                fetch(`${config.domain}/webrtc/ice`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ice: event.candidate, username: props.friend})
                });
            }
        });
        setIsCalling(false);
    }

    return (
        <Card className={styles.chat}>
            <div className={styles.header}>
                <h1>{(isCalling ? "Calling " : "") + props.friend}</h1> 
                <button onClick={() => {props.setBody(<Chat friend={props.friend} setBody={props.setBody} />);}}>Close</button>
            </div>
            <div className={styles.webcams}>
                <video id="local_cam" playsInline autoPlay ref={webcam_ref}></video>
                <video id="remote_cam" playsInline autoPlay ref={remote_ref}></video>
            </div>
        </Card>
    );
};

export default Video;
