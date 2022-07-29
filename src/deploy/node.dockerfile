FROM    node:latest
COPY    . /var/chatter
WORKDIR /var/chatter
RUN     npm install
EXPOSE  8000
ENTRYPOINT  ["npm", "start"]
