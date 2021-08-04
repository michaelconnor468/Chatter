import React from 'react';
import config from '../../config';
import styles from './Header.module.css';
import { AuthContext } from '../../App';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
    const authContext = React.useContext(AuthContext);

    const signOut = async () => {
        const rawResponse = await fetch(`${config.domain}/user/login`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: ''
        });
        authContext.setSignedIn('');
    };

    return (
        <header className={styles.header}>
            <div className={styles.icon}>
                <img src='../resources/chaticonwhite.png'/>
            </div>
            { authContext.signedIn ? <button className={styles.signout} onClick={signOut}>Sign Out</button> : <></> }
        </header>
    );
};

export default Header;