var express = require('express');

// importing utils
const sqlinit = require('./utils/sqlinit.js');
const config = require('./utils/config.js');

// importing routes
const public = require('./routes/public.js');
const root = require('./routes/root.js');
const auth = require('./routes/dirs/auth.js');
const guides = require('./routes/dirs/guides.js');

// initializing app
var app = express();

// initializaing utils
const connection = sqlinit.initialize();
// var connection = null;
config(express, app);

// initializing routes
public(express, app);
root(express, app);
auth(express, app, connection);
guides(express, app);

// starting server
app.listen(3000);
