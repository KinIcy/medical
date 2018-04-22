import { Router } from 'express';

import { models } from '../db';

const router = Router();

router.post('/', async (req, res) => {
  if (req.user.scope.indexOf('admin') < 0) {
    res.status(401).send({ error: 'No tienes permisos para realizar esta acción' });
  } else if (!req.body.nombres.length || !req.body.apellidos.length || !req.body.usuario.length ||
            !req.body.especialidad.length || !req.body.contrasena.length
  ) {
    res.status(400).send({ error: 'Por favor verifique que todos los campos han sido dilegenciados correctamente' });
  } else if (req.body.contrasena !== req.body.confirmacion) {
    res.status(400).send({ error: 'La contraseña y su confirmación no coinciden' });
  } else if (await models.Medico.findOne({
    where: { usuario: req.body.usuario },
  })) {
    res.status(400).send({ error: 'Ya existe un medico con el usuario ingresado' });
  } else {
    await models.Medico.create({
      nombres: req.body.nombres,
      apellidos: req.body.apellidos,
      usuario: req.body.usuario,
      especialidad: req.body.especialidad,
      contrasena: req.body.contrasena,
    });
    res.status.send({ status: 'OK' });
  }
});

router.get('/', async (req, res) => {
  let medicos;
  const attributes = ['idMedico', 'nombres', 'apellidos'];

  if (req.user.scope.indexOf('paciente') < 0) {
    medicos = await models.Medico.findAll({ attributes });
  } else {
    medicos = await models.Medico.findAll({
      include: {
        model: models.Cita,
        where: { idPaciente: req.user.idPaciente },
      },
      attributes,
    });
  }
  res.send({ medicos: medicos.filter(medico => medico.dataValues) });
});

router.get('/:id', async (req, res) => {
  const attributes = { exclude: ['contraseña'] };

  if (req.user.scope.indexOf('paciente') < 0) {
    const medico = await models.Medico.findOne({
      where: { idMedico: req.params.id },
      attributes,
    });
    if (medico) {
      res.send(medico.dataValues);
    } else res.status(404).send({ error: 'Medico no encontrado' });
  } else {
    const medico = await models.Medico.findOne({
      include: {
        model: models.Cita,
        where: { idPaciente: req.user.idPaciente },
      },
      attributes,
    });
    if (medico) {
      res.send(medico.dataValues);
    } else res.status(404).send({ error: 'Medico no encontrado o permisos insuficientes' });
  }
});

export default router;
