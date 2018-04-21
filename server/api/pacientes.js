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

router.get('/', async (req, res) => {
  if (req.user.scope.indexOf('paciente') >= 0) {
    res.status(401).send({ error: 'No tienes permisos para ver este contenido' });
  } else {
    const pacientes = await models.Paciente.findAll({
      attributes: ['tipoId', 'numId', 'nombres', 'estado'],
    });
    res.send({ pacientes });
  }
});

router.get('/:id', async (req, res) => {
  if (req.user.scope.indexOf('paciente') >= 0) {
    res.status(401).send({ error: 'No tienes permisos para ver este contenido' });
  } else {
    const paciente = await models.Paciente.findOne({
      where: { tipoId: req.params.id.substring(0, 2), numId: req.params.id.substring(2) },
      attributes: { exclude: ['constrasena'] },
    });
    if (paciente) {
      res.send(paciente);
    } else res.status(404).send({ error: 'Paciente no encontrado' });
  }
});

export default router;
