import { Router } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import jwt from 'express-jwt';

import auth from './auth';
import pacientes from './pacientes';
import medicos from './medicos';
import citas from './citas';

const router = Router();


// Install middleware
router.use(morgan());
router.use(cookieParser());
router.use(bodyParser.json());

// JWT middleware
router.use(jwt({
  secret: 'dummy' || process.env.SECRET,
}).unless({
  path: '/api/auth/login',
}));

router.use('/auth', auth);
router.use('/pacientes', pacientes);
router.use('/medicos', medicos);
router.use('/citas', citas);

router.use((err, req, res, next) => {
  if (err.name) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send({ error: 'Invalid Token' });
    } else throw err;
  } else next();
});

router.use((req, res) => {
  res.status(404).send({ error: 'Not found' });
});

export default router;
