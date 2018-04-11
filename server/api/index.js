import { Router } from 'express';

import auth from './auth';
import pacientes from './pacientes';

const router = Router();

router.use('/auth', auth);
router.use('/pacientes', pacientes);

export default router;
