const mongoose = require('mongoose'),
	  config = require('../config'),
      dbUrl = config.get('mongoose:uri');

mongoose.connect(dbUrl);

var db = mongoose.connection;

db.on('error', function (err) {
	console.error('Connection error:', err.message);
});

db.once('open', function callback () {
	console.log("Connected to DB!");
});

module.exports = mongoose;