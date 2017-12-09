const express = require('express'),
      app = express(),
      port = 8080,
      vegetables = require('./app/routes/vegetablesRoutes');

app.use('/api/vegetables', vegetables);

app.listen(port, () => {
  console.log('Server running on port:' + port);
});  