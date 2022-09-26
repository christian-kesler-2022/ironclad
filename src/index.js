var express = require('express');

const sqlt = require('./utils/sqlt.js');

const config = require('./routes/config.js');
const public = require('./routes/public.js');

const main = require('./routes/main.js');
const auth = require('./routes/auth.js');
const account = require('./routes/account.js');

const connection = sqlt.initialize();

var app = express();

config(express, app)
public(express, app);

main(express, app)
auth(express, app, connection)
account(express, app)


app.listen(3000);
