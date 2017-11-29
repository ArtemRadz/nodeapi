const express = require('express'),
      dbUrl = require('./config/db'),
      app = express(),
      port = 8080,
      vegetables = require('./app/routes/vegetablesRoutes'),
      db = require('./app/db');


app.use('/vegetables', vegetables);

db.connect(dbUrl.url, (err) => {
  if(err) {
    console.log('unable');
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log('Server running on port:' + port);
    });   
  }
});