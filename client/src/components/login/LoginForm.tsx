import React from 'react';
import styles from './Form.module.css';

interface LoginFormProps {
    setLogin: React.Dispatch<React.SetStateAction<boolean>>
}

const LoginForm: React.FC<LoginFormProps> = (props) => {
    const submitLogin = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    return (
        <form onSubmit={submitLogin} className={styles.form}>
            <label htmlFor='registration-username'><b>Username</b></label>
            <input type='text' id='login-username' />
            <label htmlFor='registration-username'><b>Password</b></label>
            <input type='password' id='login-password' />
            <button>Login</button>
            <button onClick={() => props.setLogin(false)}>Create an Account</button>
        </form>
    );
}

export default LoginForm;