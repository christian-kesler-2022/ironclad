var url = require('url');
var crypto = require('crypto');

module.exports = function (express, app, connection) {
  app.get('/auth/register', function (req, res) {
    res.render('auth/register', {
      loggedin: req.session.loggedin,
      username: req.session.username,
      nickname: req.session.nickname,
      pfp: req.session.pfp,
      theme: req.session.theme,
    });
  });

  app.post('/auth/register', async function (req, res) {
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password1;
    let salt = crypto.randomBytes(16).toString('hex');
    let hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    async function validateRegistration(email, username, password, callback) {
      if (email && username && password) {
        try {
          await connection.query(
            'SELECT * FROM accounts WHERE email = ? OR username = ?',
            [email, username],
            function (error, results, fields) {
              if (error) throw error;
              if (results.length == 0) {
                callback(true);
              } else {
                res.render('auth/register', {
                  loggedin: req.session.loggedin,
                  username: req.session.username,
                  nickname: req.session.nickname,
                  pfp: req.session.pfp,
                  theme: req.session.theme,
                  red_message: 'That Username or Email are already in use',
                });
              }
            }
          );
        } catch (err) {
          res.render('auth/register', {
            loggedin: req.session.loggedin,
            username: req.session.username,
            nickname: req.session.nickname,
            pfp: req.session.pfp,
            theme: req.session.theme,
            red_message: 'Something went wrong, please try again later',
          });
        }
      } else {
        res.render('auth/register', {
          loggedin: req.session.loggedin,
          username: req.session.username,
          nickname: req.session.nickname,
          pfp: req.session.pfp,
          theme: req.session.theme,
          red_message: 'You must enter an email, username, and password',
        });
      }
    }

    async function completeRegistration(valid) {
      if (valid) {
        connection.query(
          'INSERT INTO accounts (email, username, hash, salt, nickname, pfp, theme) VALUES (?, ?, ?, ?, ?, ?, ?);',
          [
            email,
            username,
            hash,
            salt,
            username,
            '/images/contacts.png',
            '/styles/themes/light.css',
          ],
          function (error, results, fields) {
            if (error) throw error;
            function setVars() {
              return new Promise((resolve) => {
                req.session.loggedin = true;
                req.session.username = username;
                req.session.nickname = username;
                req.session.pfp = '/images/contacts.png';
                req.session.theme = '/styles/themes/light.css';

                resolve();
              });
            }

            function redirectUser() {
              return new Promise((resolve) => {
                res.redirect('/account?tab=home');
                resolve();
              });
            }

            setVars().then(() => redirectUser());
          }
        );
      } else {
        res.render('auth/register', {
          loggedin: req.session.loggedin,
          username: req.session.username,
          nickname: req.session.nickname,
          pfp: req.session.pfp,
          theme: req.session.theme,
          red_message: 'Something went wrong, please try again later',
        });
      }
    }
    await validateRegistration(email, username, password, completeRegistration);
  });

  app.get('/auth/login', function (req, res) {
    res.render('auth/login', {
      loggedin: req.session.loggedin,
      username: req.session.username,
      nickname: req.session.nickname,
      pfp: req.session.pfp,
      theme: req.session.theme,
    });
  });

  app.post('/auth/login', function (req, res) {
    var ip =
      request.headers['x-forwarded-for'] ||
      request.socket.remoteAddress ||
      null;

    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
      connection.query(
        'SELECT * FROM accounts WHERE username = ? OR email = ?',
        [username, username],
        function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            function setHash() {
              return new Promise((resolve) => {
                let hash = crypto
                  .pbkdf2Sync(password, results[0].salt, 1000, 64, `sha512`)
                  .toString(`hex`);
                resolve(hash);
              });
            }

            function compareHash(hash) {
              return new Promise((resolve) => {
                if (hash == results[0].hash) {
                  req.session.loggedin = true;
                  req.session.username = username;
                  req.session.nickname = results[0].nickname;
                  req.session.pfp = results[0].pfp;
                  req.session.theme = results[0].theme;
                  req.session.ip = ip;

                  res.redirect('/account?tab=home');
                  // req.session.ip = ip;
                } else {
                  res.render('auth/login', {
                    loggedin: req.session.loggedin,
                    username: req.session.username,
                    nickname: req.session.nickname,
                    pfp: req.session.pfp,
                    theme: req.session.theme,
                    red_message: 'Incorrect Username and/or Password',
                  });
                }
                resolve();
              });
            }

            setHash().then((data) => compareHash(data));
          } else {
            res.render('auth/login', {
              loggedin: req.session.loggedin,
              username: req.session.username,
              nickname: req.session.nickname,
              pfp: req.session.pfp,
              theme: req.session.theme,
              red_message: 'Incorrect Username and/or Password',
            });
          }
        }
      );
    } else {
      res.render('auth/login', {
        loggedin: req.session.loggedin,
        username: req.session.username,
        nickname: req.session.nickname,
        pfp: req.session.pfp,
        theme: req.session.theme,
        red_message: 'You must enter a Username and Password',
      });
    }
  });

  app.post('/auth/logout', function (req, res) {
    req.session.loggedin = false;
    req.session.username = '';
    req.session.nickname = '';
    req.session.pfp = '';
    req.session.theme = '';
    req.session.ip = '';

    res.render('auth/login', {
      loggedin: req.session.loggedin,
      username: req.session.username,
      nickname: req.session.nickname,
      pfp: req.session.pfp,
      theme: req.session.theme,
      green_message: 'You have successfully logged out',
    });
  });

  app.get('/auth/forgot-password', function (req, res) {
    res.render('auth/forgot-password', {
      loggedin: req.session.loggedin,
      username: req.session.username,
      nickname: req.session.nickname,
      pfp: req.session.pfp,
      theme: req.session.theme,
    });
  });

  app.post('/auth/forgot-password', async function (req, res) {
    let identifier = req.body.identifier;

    let reset_salt = crypto.randomBytes(16).toString('hex');

    async function getAccount(identifier, reset_salt, callback) {
      if (identifier && reset_salt) {
        try {
          await connection.query(
            'SELECT * FROM accounts WHERE email = ? OR username = ?',
            [identifier, identifier],
            function (error, results, fields) {
              if (error) throw error;
              if (results.length == 1) {
                callback(results[0].email, results[0].username, reset_salt);
              } else {
                res.render('auth/forgot-password', {
                  loggedin: req.session.loggedin,
                  username: req.session.username,
                  nickname: req.session.nickname,
                  pfp: req.session.pfp,
                  theme: req.session.theme,
                  red_message: "That entry doesn't match our records",
                });
              }
            }
          );
        } catch (err) {
          res.render('auth/forgot-password', {
            loggedin: req.session.loggedin,
            username: req.session.username,
            nickname: req.session.nickname,
            pfp: req.session.pfp,
            theme: req.session.theme,
            red_message: 'Something went wrong, please try again later',
          });
        }
      } else {
        res.render('auth/forgot-password', {
          loggedin: req.session.loggedin,
          username: req.session.username,
          nickname: req.session.nickname,
          pfp: req.session.pfp,
          theme: req.session.theme,
          red_message: 'You must enter a valid username or email',
        });
      }
    }

    async function setReset(email, username, reset_salt) {
      if (email && username && reset_salt) {
        connection.query(
          'UPDATE accounts SET reset_key = ? WHERE email = ? AND username = ?;',
          [reset_salt, email, username],
          function (error, results, fields) {
            if (error) throw error;
            res.render('auth/forgot-password', {
              loggedin: req.session.loggedin,
              username: req.session.username,
              nickname: req.session.nickname,
              pfp: req.session.pfp,
              theme: req.session.theme,
              green_message: `Email sent, please check your inbox<br>
                        <a href="/auth/reset-password?email=${email}&username=${username}&reset_key=${reset_salt}">Reset Link</a>`,
            });
          }
        );
      } else {
        res.render('auth/register', {
          loggedin: req.session.loggedin,
          username: req.session.username,
          nickname: req.session.nickname,
          pfp: req.session.pfp,
          theme: req.session.theme,
          red_message: 'Something went wrong, please try again later',
        });
      }
    }
    await getAccount(identifier, reset_salt, setReset);
  });

  app.get('/auth/reset-password', function (req, res) {
    const queryObject = url.parse(req.url, true).query;

    let username = queryObject.username;
    let email = queryObject.email;
    let reset_key = queryObject.reset_key;

    if (username && email && reset_key) {
      try {
        connection.query(
          'SELECT * FROM accounts WHERE username = ? AND email = ? AND reset_key = ?',
          [username, email, reset_key],
          function (error, results, fields) {
            if (error) throw error;
            if (results.length == 1) {
              res.render('auth/reset-password', {
                loggedin: req.session.loggedin,
                // username: req.session.username,
                nickname: req.session.nickname,
                pfp: req.session.pfp,
                theme: req.session.theme,
                username: username,
                email: email,
                reset_key: reset_key,
                green_message:
                  'Hello ' + username + ', please enter your new password',
              });
            } else {
              res.render('auth/error', {
                loggedin: req.session.loggedin,
                username: req.session.username,
                nickname: req.session.nickname,
                pfp: req.session.pfp,
                theme: req.session.theme,

                red_message: 'That link has expired',
              });
            }
          }
        );
      } catch (err) {
        res.render('auth/error', {
          loggedin: req.session.loggedin,
          username: req.session.username,
          nickname: req.session.nickname,
          pfp: req.session.pfp,
          theme: req.session.theme,

          red_message: 'Something went wrong, please try again later',
        });
      }
    } else {
      res.render('auth/error', {
        loggedin: req.session.loggedin,
        username: req.session.username,
        nickname: req.session.nickname,
        pfp: req.session.pfp,
        theme: req.session.theme,

        red_message: 'You must enter valid parameters',
      });
    }
  });

  app.post('/auth/reset-password', async function (req, res) {
    let email = req.body.email;
    let username = req.body.username;
    let reset_key = req.body.reset_key;
    let password = req.body.password1;
    let salt = crypto.randomBytes(16).toString('hex');
    let hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    if (email && username && reset_key && password && salt && hash) {
      try {
        await connection.query(
          'UPDATE accounts SET reset_key = NULL, salt = ?, hash = ? WHERE email = ? AND username = ? AND reset_key = ? AND reset_key IS NOT NULL;',
          [salt, hash, email, username, reset_key],
          function (error, results, fields) {
            if (error) throw error;
            if (results.changedRows == 1) {
              res.render('auth/success', {
                loggedin: req.session.loggedin,
                username: req.session.username,
                nickname: req.session.nickname,
                pfp: req.session.pfp,
                theme: req.session.theme,
                green_message:
                  'Password changed, please Login <a href="/auth/login">here</a>',
              });
            } else {
              res.render('auth/error', {
                loggedin: req.session.loggedin,
                username: req.session.username,
                nickname: req.session.nickname,
                pfp: req.session.pfp,
                theme: req.session.theme,
                red_message: 'Something went wrong, please try again later',
              });
            }
          }
        );
      } catch (err) {
        res.redirect('/error');
      }
    } else {
      res.render('auth/reset-password', {
        loggedin: req.session.loggedin,
        username: req.session.username,
        nickname: req.session.nickname,
        pfp: req.session.pfp,
        theme: req.session.theme,
        red_message: 'You must enter a password',
      });
    }
  });

  app.post('/auth/update-nickname', async function (req, res) {
    var ip =
      request.headers['x-forwarded-for'] ||
      request.socket.remoteAddress ||
      null;

    let new_nickname = req.body.new_nickname;
    let username = req.session.username;

    // console.log('new_nickname: ' + new_nickname);
    // console.log('username: ' + username);
    // console.log('req.session.loggedin: ' + req.session.loggedin);

    if (
      new_nickname &&
      username &&
      req.session.loggedin == true &&
      req.session.ip == ip
    ) {
      try {
        await connection.query(
          'UPDATE accounts SET nickname = ? WHERE username = ?;',
          [new_nickname, username],
          function (error, results, fields) {
            if (error) throw error;
            if (results.changedRows == 1) {
              req.session.nickname = new_nickname;
              res.redirect('/account?tab=home');
            } else {
              res.render('auth/error', {
                loggedin: req.session.loggedin,
                username: req.session.username,
                nickname: req.session.nickname,
                pfp: req.session.pfp,
                theme: req.session.theme,
                red_message: 'Looks like no rows were changed',
              });
            }
          }
        );
      } catch (err) {
        res.render('auth/error', {
          loggedin: req.session.loggedin,
          username: req.session.username,
          nickname: req.session.nickname,
          pfp: req.session.pfp,
          theme: req.session.theme,
          red_message: 'Connection failed',
        });
      }
    } else {
      res.render('auth/error', {
        loggedin: req.session.loggedin,
        username: req.session.username,
        nickname: req.session.nickname,
        pfp: req.session.pfp,
        theme: req.session.theme,
        red_message: 'parameters failed',
      });
    }
  });

  app.post('/auth/update-pfp', async function (req, res) {
    var ip =
      request.headers['x-forwarded-for'] ||
      request.socket.remoteAddress ||
      null;

    let new_pfp_path = req.body.new_pfp_path;
    let new_pfp_url = req.body.new_pfp_url;
    let username = req.session.username;

    // console.log('new_pfp_path: ' + new_pfp_path);
    // console.log('new_pfp_url: ' + new_pfp_url);
    // console.log('username: ' + username);
    // console.log('req.session.loggedin: ' + req.session.loggedin);

    function comparePfps() {
      return new Promise((resolve) => {
        // console.log('comparing. . . ');
        // console.log('path: ' + new_pfp_path);
        // console.log('url: ' + new_pfp_url);
        if (new_pfp_path === '' && new_pfp_url !== '') {
          // console.log('using url ');
          let new_pfp = new_pfp_url;
          resolve(new_pfp);
        } else {
          // console.log('using path ');
          let new_pfp = new_pfp_path;
          resolve(new_pfp);
        }
      });
    }

    function writePfp(new_pfp) {
      return new Promise((resolve) => {
        if (
          new_pfp &&
          username &&
          req.session.loggedin == true &&
          req.session.ip == ip
        ) {
          try {
            connection.query(
              'UPDATE accounts SET pfp = ? WHERE username = ?;',
              [new_pfp, username],
              function (error, results, fields) {
                if (error) throw error;
                req.session.pfp = new_pfp;
                res.redirect('/account?tab=home');

                // if (results.changedRows == 1) {
                //     req.session.pfp = new_pfp;
                //     res.redirect('/account?tab=home');
                // } else {
                //     res.render('auth/error', {
                //         loggedin: req.session.loggedin,
                //         username: req.session.username,
                //         nickname: req.session.nickname,
                //         pfp: req.session.pfp,
                //         theme: req.session.theme,
                //         red_message: 'Looks like no rows were changed'
                //     });
                // }
              }
            );
          } catch (err) {
            res.render('auth/error', {
              loggedin: req.session.loggedin,
              username: req.session.username,
              nickname: req.session.nickname,
              pfp: req.session.pfp,
              theme: req.session.theme,
              red_message: 'Connection failed',
            });
          }
        } else {
          res.redirect('/account?tab=home');

          // res.render('auth/error', {
          //     loggedin: req.session.loggedin,
          //     username: req.session.username,
          //     nickname: req.session.nickname,
          //     pfp: req.session.pfp,
          //     theme: req.session.theme,
          //     red_message: 'parameters failed'
          // });
        }
        resolve();
      });
    }

    comparePfps().then((new_pfp) => writePfp(new_pfp));
  });

  app.post('/auth/update-theme', async function (req, res) {
    var ip =
      request.headers['x-forwarded-for'] ||
      request.socket.remoteAddress ||
      null;

    let new_theme = req.body.new_theme;
    let username = req.session.username;

    // console.log('new_theme: ' + new_theme);
    // console.log('username: ' + username);
    // console.log('req.session.loggedin: ' + req.session.loggedin);

    if (
      new_theme &&
      username &&
      req.session.loggedin == true &&
      req.session.ip == ip
    ) {
      try {
        await connection.query(
          'UPDATE accounts SET theme = ? WHERE username = ?;',
          [new_theme, username],
          function (error, results, fields) {
            if (error) throw error;
            if (results.changedRows == 1) {
              req.session.theme = new_theme;
              res.redirect('/account?tab=home');
            } else {
              res.render('auth/error', {
                loggedin: req.session.loggedin,
                username: req.session.username,
                nickname: req.session.nickname,
                pfp: req.session.pfp,
                theme: req.session.theme,
                red_message: 'Looks like no rows were changed',
              });
            }
          }
        );
      } catch (err) {
        res.render('auth/error', {
          loggedin: req.session.loggedin,
          username: req.session.username,
          nickname: req.session.nickname,
          pfp: req.session.pfp,
          theme: req.session.theme,
          red_message: 'Connection failed',
        });
      }
    } else {
      res.render('auth/error', {
        loggedin: req.session.loggedin,
        username: req.session.username,
        nickname: req.session.nickname,
        pfp: req.session.pfp,
        theme: req.session.theme,
        red_message: 'parameters failed',
      });
    }
  });
};
