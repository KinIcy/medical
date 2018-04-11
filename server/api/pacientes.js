import { Router } from 'express';

import { models } from '../db';

const router = Router();

router.post('/', async (req, res) => {
  if (!req.body.nombres.length || !res.body.apellidos.length || !res.body.numId.length ||
    !res.body.fechaNacimiento.length || !res.body.telefono.length || !res.body.correo.length ||
    !res.body.ciudad.length || !res.body.tipoId.length
  ) {
    res.status(400).json({ error: 'Por favor verifique que todos los campos han sido dilegenciados correctamente' });
  } else if (await models.Paciente.findOne({
    where: { numId: req.body.numId, tipoId: req.body.tipoId },
  })) {
    res.status(400).json({ error: 'Ya existe un paciente registrado con mismo documento de identiidad' });
  } else {
    await models.Paciente.create({
      tipoId: req.body.tipoId,
      numId: req.body.numId,
      nombres: req.body.nombres,
      apellidos: req.body.apellidos,
      fechaNacimiento: req.body.fechaNacimiento,
      telefono: req.body.telefono,
      correo: req.body.correo,
      constrasena: crypto.randomBytes(20).toString('hex'),
    });
    res.status(201).json({ status: 'OK' });
  }
});

export default router;
