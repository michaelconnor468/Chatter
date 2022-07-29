#!/bin/sh
ENVIRONMENT="prod"
CHATTER_NETWORK="chatter-network"
POSTGRES_CONTAINER_NAME="chatter-postgres"
POSTGRES_CONTAINER_ID=""
NODE_CONTAINER_NAME="chatter-node"
NODE_CONTAINER_ID=""
PORT=8000

setup_postgres_container() {
    POSTGRES_CONTAINER_ID=$(docker run -d --net $CHATTER_NETWORK --name $POSTGRES_CONTAINER_NAME -e POSTGRES_PASSWORD=password postgres)
    docker cp ./src/deploy/seed.sql $POSTGRES_CONTAINER_ID:/seed.sql
    sleep 1
    docker exec $POSTGRES_CONTAINER_ID sh -c 'su - postgres -c "psql -f /seed.sql"'
}

setup_node_container() {
    npm run build
    if ! docker images | grep chatter/node; then
        docker build -t chatter/node .
    fi
    NODE_CONTAINER_ID=$(docker run -d --net $CHATTER_NETWORK --name $NODE_CONTAINER_NAME --link $POSTGRES_CONTAINER_NAME -p $PORT:$PORT -e PORT=$PORT -e POSTGRES_HOST=$POSTGRES_CONTAINER_NAME -e ENVIRONMENT=$ENVIRONMENT chatter/node)
}

bring_down_postgres_container() {
    if docker ps -a | grep $POSTGRES_CONTAINER_NAME; then
        POSTGRES_CONTAINER_ID=$(docker ps -a | grep $POSTGRES_CONTAINER_NAME | awk '{print $1}')
        docker stop $POSTGRES_CONTAINER_ID
        docker rm $POSTGRES_CONTAINER_ID
    fi
}

bring_down_node_container() {
    if docker ps -a | grep $NODE_CONTAINER_NAME; then
        NODE_CONTAINER_ID=$(docker ps -a | grep $NODE_CONTAINER_NAME | awk '{print $1}')
        docker stop $NODE_CONTAINER_ID
        docker rm $NODE_CONTAINER_ID
    fi
    if docker images | grep chatter/node; then
        NODE_IMAGE_ID=$(docker images | grep chatter/node | awk '{print $3}')
        docker rmi $NODE_IMAGE_ID
    fi
}

if [ $# -lt 1 -o $# -gt 2 ]; then
    echo "usage: deploy.sh <up|down> [dev|prod]"
    echo "environment defaults to prod"
    exit 1
elif [ $1 = "up" ]; then
    if [ $# -eq 2 ] && [ $2 = "dev" ]; then
        ENVIRONMENT="dev"
    fi
    echo "setting up containers in $ENVIRONMENT"
    setup_postgres_container
    setup_node_container
elif [ $1 = "down" ]; then
    echo "bringing down containers in $ENVIRONMENT"
    bring_down_node_container
    bring_down_postgres_container
else
    echo "usage: deploy.sh <up|down> [dev|prod]"
    exit 1
fi

exit 0
