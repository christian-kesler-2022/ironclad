const mysql = require('mysql');

var sqlt = {
  initialize: function () {
    var con = mysql.createConnection({
      host: '172.17.0.2',
      user: 'root',
      password: 'secret',
      database: `ironclad_2`,
    });

    return con;
  },
};

module.exports = sqlt;
