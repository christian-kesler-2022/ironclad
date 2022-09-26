const mysql = require('mysql');

var sqlt = {
  initialize: function () {
    var con = mysql.createConnection({
      host: '172.17.0.2',
      user: 'root',
      password: 'secret',
      database: `ironclad_2`,
    });

    con.query('CREATE SCHEMA `ironclad_2`;');
    con.query(
      'CREATE TABLE `ironclad_2`.`accounts` ( `id` INT NOT NULL AUTO_INCREMENT, `email` VARCHAR(255) NULL, `username` VARCHAR(255) NULL, `hash` VARCHAR(255) NULL, `salt` VARCHAR(255) NULL, `reset_key` VARCHAR(255) NULL, `nickname` VARCHAR(255) NULL, `pfp` VARCHAR(255) NULL, `theme` VARCHAR(255) NULL, `created_at` DATETIME NULL, `updated_at` DATETIME NULL, `deleted_at` DATETIME NULL, PRIMARY KEY (`id`));'
    );
    return con;
  },
};

module.exports = sqlt;
