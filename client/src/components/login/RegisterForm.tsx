import React from 'react';
import styles from './Form.module.css';

interface RegisterFormProps {
    setLogin: React.Dispatch<React.SetStateAction<boolean>>
}

const RegisterForm: React.FC<RegisterFormProps> = (props) => {
    const submitRegister = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    return (
        <form onSubmit={submitRegister} className={styles.form}>
            <label htmlFor='registration-username'><b>Username</b></label>
            <input type='text' id='registration-username' />
            <label htmlFor='registration-username'><b>Email</b></label>
            <input type='text' id='registration-email' />
            <label htmlFor='registration-username'><b>Password</b></label>
            <input type='password' id='registration-password' />
            <label htmlFor='registration-username'><b>Confirm Password</b></label>
            <input type='password' id='registration-confirm-password' />
            <button>Register</button>
            <button onClick={() => props.setLogin(true)}>Already Have an Account</button>
        </form>
    );
}

export default RegisterForm;