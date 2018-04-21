import { Router } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import jwt from 'express-jwt';

import auth from './auth';
import pacientes from './pacientes';

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

router.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({ error: 'Invalid Token' });
  } else next();
});

export default router;
