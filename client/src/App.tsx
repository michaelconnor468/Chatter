import React from 'react';
import Header from './components/main/Header';
import Body from './components/main/Body'
import styles from './App.module.css';
import './App.css';

interface AppProps {}
interface JWT {
    username: string,
    hash: string
}

export const AuthContext = React.createContext<{jwt: JWT, setJWT: React.Dispatch<React.SetStateAction<JWT>>}>({} as {jwt: JWT, setJWT: React.Dispatch<React.SetStateAction<JWT>>});

const App: React.FC<AppProps> = () => {
    const cookie = getCookie('chatter-jwt');
    console.log('test');
    console.log(document.cookie);
    if ( cookie ) console.log( JSON.parse(cookie));
    const [jwt, setJWT] = React.useState(cookie ? JSON.parse(cookie) : {username: '', hash: ''});

    return (
        <AuthContext.Provider value={{jwt, setJWT}}>
            <Header />
            <Body />
        </AuthContext.Provider>
    );
};

const getCookie = (cname: string) => {
    let name = cname + "=";
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
    return "";
}

export default App;