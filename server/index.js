import './env';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from 'express-jwt';
import { Nuxt, Builder } from 'nuxt';
import { initialize } from './db/';

import api from './api';

const app = express();
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

app.set('port', port);

// Install middleware
app.use(cookieParser());
app.use(bodyParser.json());

// JWT middleware
app.use(jwt({
  secret: 'dummy' || process.env.SECRET,
}).unless({
  path: '/api/auth/login',
}));


// Import API Routes
app.use('/api', api);

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');

config.dev = !(process.env.NODE_ENV === 'production');

// Init Nuxt.js
const nuxt = new Nuxt(config);

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt);
  builder.build();
}

// Give nuxt middleware to express
app.use(nuxt.render);

// Listen the server
initialize().then(() => app.listen(port, host)).then(() => {
  console.log(`Server listening on ${host}:${port}`); // eslint-disable-line no-console
}).catch((error) => {
  throw error;
});
