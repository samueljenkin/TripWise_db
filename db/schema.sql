CREATE DATABASE holiday_app;
\c holiday_app

CREATE TABLE users(
    id serial PRIMARY KEY,
    username TEXT,
    email TEXT,
    password_digest TEXT
);

INSERT INTO users(username, email, password_digest) VALUES('Guest', 'guest', 'guest');
-- for people who dont want to make an account

CREATE TABLE attractions(
    id serial PRIMARY KEY,
    user_id INTEGER,
    trip_id INTEGER,
    display_name TEXT,
    website_uri TEXT,
    price_level INTEGER,
    rating TEXT
);