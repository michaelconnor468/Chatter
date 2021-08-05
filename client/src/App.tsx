import React from 'react';
import Header from './components/main/Header';
import Body from './components/main/Body';
import config from './config';
import { io, Socket } from '../node_modules/socket.io-client/build/index';
import styles from './App.module.css';
import './App.css';

interface AppProps {}
interface JWT {
    username: string,
    hash: string
}

export const AuthContext = React.createContext<{ signedIn: string, setSignedIn: React.Dispatch<string>, socket: Socket }>({} as { signedIn: string, setSignedIn: React.Dispatch<string>, socket: Socket });

const App: React.FC<AppProps> = () => {
    const cookie = getCookie('chatter-jwt');
    // Used as a context to simplify logic pertaining to current user.
    const [signedIn, setSignedIn] = React.useState<string>(cookie && JSON.parse(cookie).username && JSON.parse(cookie).hash ? JSON.parse(cookie).username : '');
    const [socket, setSocket] = React.useState(io(config.domain));

    // Reconnect to socket as long as client-side application runs.
    socket.on('disconnect', () => setSocket(io(config.domain)));

    return (
        <AuthContext.Provider value={{signedIn, setSignedIn, socket}}>
            <Header />
            <Body />
        </AuthContext.Provider>
    );
};

const getCookie = (cname: string) => {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
}

export default App;