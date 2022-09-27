module.exports = function (express, app) {
    app.get('/', function (req, res) {
        console.log(req.session.loggedin);
        res.render('index', {
            loggedin: req.session.loggedin,
            username: req.session.username,
            nickname: req.session.nickname,
            pfp: req.session.pfp,
            theme: req.session.theme,
        });
    });

    app.get('/search', function (req, res) {
        res.render('indivs/search', {
            loggedin: req.session.loggedin,
            username: req.session.username,
            nickname: req.session.nickname,
            pfp: req.session.pfp,
            theme: req.session.theme,
        });

    });

};
