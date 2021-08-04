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

export const AuthContext = React.createContext<{ signedIn: string; setSignedIn: React.Dispatch<string> }>({} as { signedIn: string; setSignedIn: React.Dispatch<string> });

const App: React.FC<AppProps> = () => {
    const cookie = getCookie('chatter-jwt');
    const [signedIn, setSignedIn] = React.useState<string>(cookie && JSON.parse(cookie).username && JSON.parse(cookie).hash ? JSON.parse(cookie).username : '');

    return (
        <AuthContext.Provider value={{signedIn, setSignedIn}}>
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