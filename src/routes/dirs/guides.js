module.exports = function (express, app) {
  app.get('/guides/jira/local-server', function (req, res) {
    res.render('guides/jira/local-server', {
      loggedin: req.session.loggedin,
      username: req.session.username,
      nickname: req.session.nickname,
      pfp: req.session.pfp,
      theme: req.session.theme,
    });
  });

  app.get('/guides/css/pixel-calc', function (req, res) {
    res.render('guides/css/pixel-calc', {
      loggedin: req.session.loggedin,
      username: req.session.username,
      nickname: req.session.nickname,
      pfp: req.session.pfp,
      theme: req.session.theme,
    });
  });
};
