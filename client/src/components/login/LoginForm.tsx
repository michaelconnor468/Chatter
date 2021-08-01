import React from 'react';
import { AuthContext } from '../../App';
import config from '../../config';
import styles from './Form.module.css';

interface LoginFormProps {
    setLogin: React.Dispatch<React.SetStateAction<boolean>>
}

const LoginForm: React.FC<LoginFormProps> = (props) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [invalidMessage, setInvalidMessage] = React.useState(null);
    const authContext = React.useContext(AuthContext);

    const submitLogin = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const rawResponse = await fetch(`${config.domain}/user/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        });
        console.log(rawResponse);
        const responce = await rawResponse.json();
        if ( rawResponse.ok ) authContext.setJWT(responce);
    }

    return (
        <>
        {invalidMessage}
        <form onSubmit={submitLogin} className={styles.form}>
            <label htmlFor='registration-username'><b>Username</b></label>
            <input type='text' id='login-username' onBlur={(e) => setUsername(e.target.value)} />
            <label htmlFor='registration-username'><b>Password</b></label>
            <input type='password' id='login-password' onBlur={(e) => setPassword(e.target.value)} />
            <button type='submit'>Login</button>
            <button onClick={() => props.setLogin(false)}>Create an Account</button>
        </form>
        </>
    );
}

export default LoginForm;