const express = require('express'),
      MongoClient = require('mongodb').MongoClient,
      db = require('./config/db'),
      app = express(),
      port = 8080,
      vegetables = require('./app/routes/vegetablesRoutes');

MongoClient.connect(db.url, (err, database) => {
  if (err) {
  	return console.log(err);
  }

  app.set('db', database);
  app.use('/vegetables', vegetables);
  
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });               
});