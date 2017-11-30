const mongoose = require('mongoose'),
      dbUrl = require('../config/db');

mongoose.connect(dbUrl.url);

var db = mongoose.connection;

db.on('error', function (err) {
	console.error('Connection error:', err.message);
});

db.once('open', function callback () {
	console.log("Connected to DB!");
});

module.exports = mongoose;