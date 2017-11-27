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

  database.collection('vegetables').ensureIndex("name", {"unique" : true}, (err, data) => {
     if(err) {
       res.status(503).send({'error': 'Error in database'});
    }
  });

  app.set('db', database);
  app.use('/vegetables', vegetables);

  app.listen(port, () => {
    console.log('Server running on port:' + port);
  });             
});