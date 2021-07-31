import React from 'react';
import Login from '../login/Login';
import styles from './Body.module.css';

interface BodyProps {}

const Body: React.FC<BodyProps> = () => {
    return (
        <div className={styles.body}>
            <Login />
        </div>
    );
};

export default Body;