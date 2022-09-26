# Ironclad_2

## Dependencies

    cd src
    npm install -g nodemon
    npm install express
    npm install express-session
    npm install ejs
    npm install mysql
    npm install crypto

## Containerized Database

    sudo su

<br>

    sudo apt install podman
    alias docker=podman

<br>

    docker pull docker.io/mysql:5.7
    docker run -d \
            -e MYSQL_ROOT_PASSWORD=secret \
            -e MYSQL_DATABASE=ironclad \
            mysql:5.7
    docker ps

<br>

    docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container>

## Database Configuration

    CREATE SCHEMA `ironclad` ;
    CREATE TABLE `ironclad`.`accounts` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NULL,
    `username` VARCHAR(255) NULL,
    `hash` VARCHAR(255) NULL,
    `salt` VARCHAR(255) NULL,
    `reset_key` VARCHAR(255) NULL,
    `nickname` VARCHAR(255) NULL,
    `pfp` VARCHAR(255) NULL,
    `theme` VARCHAR(255) NULL,
    `created_at` DATETIME NULL,
    `updated_at` DATETIME NULL,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`id`));
