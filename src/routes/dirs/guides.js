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
};
