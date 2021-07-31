import React from 'react';
import Header from './components/main/Header';
import Body from './components/main/Body'
import styles from './App.module.css';
import './App.css';

interface AppProps {}

const App: React.FC<AppProps> = () => {
    return (
        <>
            <Header />
            <Body />
        </>
    );
};

export default App;