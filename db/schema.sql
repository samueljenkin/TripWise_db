CREATE DATABASE holiday_app;
\c holiday_app

CREATE TABLE users(
    id serial PRIMARY KEY,
    name TEXT,
    email TEXT,
    password_digest TEXT
);