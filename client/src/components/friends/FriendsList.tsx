import React from 'react';
import styles from './FriendsList.module.css';
import Card from '../util/Card';

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
    const [login, setLogin] = React.useState(true);

    return (
        <Card className={styles.card}>
            <h1>Friends</h1>
        </Card>
    );
};

export default Login;