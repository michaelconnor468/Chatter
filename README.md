# Chatter

Chatter is a real time messaging application I built as a fun little side project to learn more about web development and practice my networking and REACT skills. Chatter is built using Typescript and a PostgreSQL database.

## Deployment

Both the node server are containerized and can be automatically deployed and linked using the given docker-compose file.

## Usage

Chatter allows for creation of account which can add each other as friends. In order to message someone, you must first add them as a friend using their username, and they must then accept your friend invitation before they can show up on your dashboard and you can click on their cards to send messages. Once you are friends with a user, you can chat back and forth in real time with your conversation being saved in the database for future reference.

## Services

The backend of chatter comprises of several RESTful services such as `users` for authentication `friends` for adding and retrieving connections, and of course, the star of the show, `messages` for not only sending and retrieving messages but relaying any messages to any related websockets in use for instant communication.

## Security

### Athentication

The app provides it's very own authentication implementation. User's passwords are safely stored within the database using salted hashing.

### Authorization

When a user is authenticated, a JSON Web Token is set as a cookie which contains their unique username which can be used to authorize operations and a hash signature the server uses to determine authenticity using a private key.

## Front End

The front end is a React single page application that tries to stay simple, minimalistic, and fast while still being (at least somewhat) intuitive and easy to use.
