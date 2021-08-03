import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    className: string,
    onClick?: () => void
}

const Card: React.FC<CardProps> = (props) => {
    return <div className={[styles.card, props.className].join(' ')} onClick={props.onClick || (() => {})}>
        {props.children}
    </div>
};

export default Card;