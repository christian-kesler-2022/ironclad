const mysql = require('mysql');

var sqlt = {
    initialize: function () {
        var con = mysql.createConnection({
            host: '10.88.0.2',
            user: 'root',
            password: 'secret',
            database: `ironclad`,
        });

        return con;
    },
};

module.exports = sqlt;
