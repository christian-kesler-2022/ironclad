var url = require('url');
const session = require('express-session');

module.exports = function (express, app) {
    app.use(
        session({
            secret: 'secret',
            resave: true,
            saveUninitialized: true,
            secure: true,
        })
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.set('view engine', 'ejs');
};
