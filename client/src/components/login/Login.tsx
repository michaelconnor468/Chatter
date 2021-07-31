import React from 'react';
import styles from './Login.module.css';
import Card from '../util/Card';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
    const [login, setLogin] = React.useState(true);

    return (
        <Card className={styles.card}>
            <h1 className={styles.intro}>Welcome to Chatter! <br />Please sign in or create an account.</h1>
            {login ? <LoginForm setLogin={setLogin}/> : <RegisterForm setLogin={setLogin}/>}
        </Card>
    );
};

export default Login;