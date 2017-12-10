const express = require('express'),
      app = express(),
      jwt = require('express-jwt'),
      jwksRsa = require('jwks-rsa'),
      cors = require('cors'),
      config = require('./config'),
      port = config.get('port'),
      AUTH0_DOMAIN = config.get('AUTH0_DOMAIN'),
      AUTH0_AUDIENCE = config.get('AUTH0_AUDIENCE'),
      vegetables = require('./routes/vegetablesRoutes');

app.use(cors());

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  audience: AUTH0_AUDIENCE,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

app.use('/api/vegetables', checkJwt, vegetables);

app.listen(port, () => {
  console.log('Server running on port:' + port);
});  