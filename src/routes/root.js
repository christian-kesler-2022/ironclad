var url = require('url');

module.exports = function (express, app) {
    app.get('/', function (req, res) {
        req.session.touch()
        console.log(req.session.loggedin);
        console.log(req.socket.localAddress);
        console.log(req.session.ip);
        res.render('index', {
            loggedin: req.session.loggedin,
            username: req.session.username,
            nickname: req.session.nickname,
            pfp: req.session.pfp,
            theme: req.session.theme,
        });
    });
    app.get('/account', function (req, res) {
        const queryObject = url.parse(req.url, true).query;

        if (req.session.loggedin == true && req.session.ip == req.socket.localAddress) {
            if (queryObject.tab !== undefined) {
                if (queryObject.tab === 'home' || queryObject.tab === 'personal-info' || queryObject.tab === 'data-and-privacy' || queryObject.tab === 'security' || queryObject.tab === 'people-and-sharing' || queryObject.tab === 'payments-and-subscriptions' || queryObject.tab === 'about') {
                    res.render('_indivs/account', {
                        loggedin: req.session.loggedin,
                        username: req.session.username,
                        nickname: req.session.nickname,
                        pfp: req.session.pfp,
                        theme: req.session.theme,
                        tab: queryObject.tab
                    });
                } else {
                    res.redirect('/account?tab=home');
                }
            } else {
                res.redirect('/account?tab=home');
            }

        } else {
            res.redirect('/auth/login');
        }
    });

    app.get('/search', function (req, res) {
        res.render('_indivs/search', {
            loggedin: req.session.loggedin,
            username: req.session.username,
            nickname: req.session.nickname,
            pfp: req.session.pfp,
            theme: req.session.theme,
        });

    });

};
