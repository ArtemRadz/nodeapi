const express = require('express'),
      app = express(),
      config = require('./config'),
      port = config.get('port'),
      vegetables = require('./routes/vegetablesRoutes');

app.use('/api/vegetables', vegetables);

app.listen(port, () => {
  console.log('Server running on port:' + port);
});  