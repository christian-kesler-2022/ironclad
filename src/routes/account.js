var url = require('url');

module.exports = function (express, app) {
    app.get('/account', function (req, res) {
        const queryObject = url.parse(req.url, true).query;

        if (req.session.loggedin == true) {
            if (queryObject.tab !== undefined) {
                if (queryObject.tab === 'home' || queryObject.tab === 'personal-info' || queryObject.tab === 'data-and-privacy' || queryObject.tab === 'security' || queryObject.tab === 'people-and-sharing' || queryObject.tab === 'payments-and-subscriptions' || queryObject.tab === 'about') {
                    res.render('account', {
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
            res.redirect('/login');
        }
    });
};
