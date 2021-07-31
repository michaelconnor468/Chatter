import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
    return (
        <header className={styles.header}>
            <div className={styles.icon}>
                <img src='../resources/chaticonwhite.png'/>
            </div>
        </header>
    );
};

export default Header;