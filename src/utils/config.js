var url = require('url');
const session = require('express-session');

module.exports = function (express, app) {
    app.use(
        session({
            cookie: {
                // httpOnly: true,
                // secure: true,
                sameSite: true,
                maxAge: 5 * 60 * 1000,
                // expires: 5 * 60 * 1000,
            },
            resave: true,
            saveUninitialized: true,
            secret: 'secret',
            secure: true,
        })
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.set('view engine', 'ejs');
};
