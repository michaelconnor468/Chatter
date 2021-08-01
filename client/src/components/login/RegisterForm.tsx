import React from 'react';
import { AuthContext } from '../../App';
import config from '../../config';
import styles from './Form.module.css';

interface RegisterFormProps {
    setLogin: React.Dispatch<React.SetStateAction<boolean>>
}

const RegisterForm: React.FC<RegisterFormProps> = (props) => {
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [secondPassword, setSecondPassword] = React.useState('');
    const [invalidMessage, setInvalidMessage] = React.useState<JSX.Element | null>(null);
    const [invalidPassword, setInvalidPassword] = React.useState<JSX.Element | null>(null);
    const [invalidUsername, setInvalidUsername] = React.useState<JSX.Element | null>(null);
    const [invalidEmail, setInvalidEmail] = React.useState<JSX.Element | null>(null);
    const [unmatchingPassword, setUnmatchingPassword] = React.useState<JSX.Element | null>(null);
    const authContext = React.useContext(AuthContext);

    const submitRegister = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if ( unmatchingPassword || invalidPassword || invalidUsername || invalidEmail ) return;
        const rawResponse = await fetch(`${config.domain}/user`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, email, password})
        });
        const responce = await rawResponse.json();
        if ( rawResponse.ok ) authContext.setJWT(responce);
    }

    if ( unmatchingPassword !== null && password === secondPassword ) setUnmatchingPassword(null);
    if ( invalidPassword && password.match(/^[a-z0-9A-Z\.\_\-]{6,20}$/) ) setInvalidPassword(null);
    if ( invalidUsername && username.match(/^[a-z0-9A-Z\.\_\-]{1,20}$/) ) setInvalidUsername(null);
    if ( invalidEmail && email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/) ) setInvalidEmail(null);

    const validatePasswordMatch = () => {
        if ( password !== secondPassword && !unmatchingPassword ) setUnmatchingPassword(<h1 className={styles.invalidMessage}>Passwords do not match</h1>);
    }
    const validatePassword = () => {
        if ( password !== '' && !invalidPassword && !password.match(/^[a-z0-9A-Z\.\_\-]{6,20}$/) ) setInvalidPassword(<h1 className={styles.invalidMessage}>Passwords must be between 6-20 common characters</h1>);
    }
    const validateUsername = () => {
        if ( username !== '' && !invalidUsername && !username.match(/^[a-z0-9A-Z\.\_\-]{1,20}$/) ) setInvalidUsername(<h1 className={styles.invalidMessage}>Usernames must be between 1-20 common characters</h1>);
    }
    const validateEmail = () => {
        if ( email !== '' && !invalidEmail && !email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/) ) setInvalidEmail(<h1 className={styles.invalidMessage}>Please enter a valid email</h1>);
    }


    return (
        <>
        {invalidMessage}
        <form onSubmit={submitRegister} className={styles.form}>
            <label htmlFor='registration-username'><b>Username</b></label>
            <input type='text' id='registration-username' value={username} onChange={(e) => setUsername(e.target.value)} onBlur={validateUsername}/>
            {invalidUsername}
            <label htmlFor='registration-username'><b>Email</b></label>
            <input type='text' id='registration-email' value={email} onChange={(e) => setEmail(e.target.value)} onBlur={validateEmail}/>
            {invalidEmail}
            <label htmlFor='registration-username'><b>Password</b></label>
            <input type='password' id='registration-password' value={password} onChange={(e) => setPassword(e.target.value)} onBlur={validatePassword}/>
            {invalidPassword}
            <label htmlFor='registration-username'><b>Confirm Password</b></label>
            <input type='password' id='registration-confirm-password' value={secondPassword} onChange={(e) => setSecondPassword(e.target.value)} onBlur={validatePasswordMatch}/>
            {unmatchingPassword}
            <button type='submit'>Register</button>
            <button onClick={() => props.setLogin(true)}>Already Have an Account</button>
        </form>
        </>
    );
}

export default RegisterForm;