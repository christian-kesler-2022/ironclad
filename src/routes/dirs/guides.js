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

  app.get('/guides/nodejs/epoch-time', function (req, res) {
    res.render('guides/nodejs/epoch-time', {
      loggedin: req.session.loggedin,
      username: req.session.username,
      nickname: req.session.nickname,
      pfp: req.session.pfp,
      theme: req.session.theme,
    });
  });
  app.get('/guides/nodejs/xml-validation', function (req, res) {
    res.render('guides/nodejs/xml-validation', {
      loggedin: req.session.loggedin,
      username: req.session.username,
      nickname: req.session.nickname,
      pfp: req.session.pfp,
      theme: req.session.theme,
    });
  });

  app.get('/guides/javascript/copy-to-clipboard', function (req, res) {
    res.render('guides/javascript/copy-to-clipboard', {
      loggedin: req.session.loggedin,
      username: req.session.username,
      nickname: req.session.nickname,
      pfp: req.session.pfp,
      theme: req.session.theme,
    });
  });

  app.get('/guides/docker/export-and-import', function (req, res) {
    res.render('guides/docker/export-and-import', {
      loggedin: req.session.loggedin,
      username: req.session.username,
      nickname: req.session.nickname,
      pfp: req.session.pfp,
      theme: req.session.theme,
    });
  });

  app.get('/guides/git/getting-started', function (req, res) {
    res.render('guides/git/getting-started', {
      loggedin: req.session.loggedin,
      username: req.session.username,
      nickname: req.session.nickname,
      pfp: req.session.pfp,
      theme: req.session.theme,
    });
  });
};
