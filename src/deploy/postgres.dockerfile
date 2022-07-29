FROM    postgres:latest
COPY    ./src/deploy/seed.sql /docker-entrypoint-initdb.d/seed.sql
