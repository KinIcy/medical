import { Router } from 'express';

import { models } from '../db';
import aeh from '../async-error-handler';

const router = Router();

router.post('/', aeh(async (req, res) => {
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
}));

router.get('/', aeh(async (req, res) => {
  let medicos;
  const attributes = ['idMedico', 'nombres', 'apellidos'];

  if (req.user.scope.indexOf('paciente') < 0) {
    medicos = await models.Medico.findAll({ attributes });
  } else {
    medicos = await models.Medico.findAll({
      attributes,
      include: [{
        model: models.Cita,
        where: { idPaciente: req.user.idPaciente },
        required: true,
        attributes: [],
      }],
    });
  }
  res.send({ medicos });
}));

router.get('/horarios', aeh(async (req, res) => {
  if (req.user.scope.indexOf('paciente') >= 0) {
    res.status(401).send({ error: 'No tienes permisos para ver este contenido' });
  } else {
    const horarios = await models.Horario.findAll({
      where: { idMedico: req.user.idMedico },
    });
    res.send({ horarios: horarios.map(horario => horario.dataValues) });
  }
}));

router.post('/horarios', aeh(async (req, res) => {
  const { dia, horaInicio, horaFin } = req.body;
  const horaRegex = /^\d{2}:\d{2}$/;
  if (req.user.scope.indexOf('paciente') >= 0) {
    res.status(401).send({ error: 'No tienes permisos para realizar esta acción' });
  } else if (!dia.length || !horaInicio.length || !horaFin.length) {
    res.status(400).send({ error: 'Por favor verifique que todos los campos han sido dilegenciados correctamente' });
  } else if (parseInt(dia, 10) < 1 || parseInt(dia, 10) > 7) {
    res.status(400).send({ error: 'Día invalido' });
  } else if (!horaRegex.test(horaInicio) || !horaRegex.test(horaFin)) {
    res.status(400).send({ error: 'Verifique que los horarios estén en formato HH:MM' });
  } else {
    await models.Horario.create({
      dia, horaInicio, horaFin, idMedico: req.user.idMedico,
    });
    res.send({ status: 'OK' });
  }
}));

router.delete('/horarios/:id', aeh(async (req, res) => {
  if (req.user.scope.indexOf('medico') < 0) {
    res.status(401).send({ error: 'No tienes permisos para realizar esta acción' });
  } else {
    await models.Horario.destroy({
      where: { idHorario: req.params.id, idMedico: req.user.idMedico },
    });
    res.send({ status: 'OK' });
  }
}));

router.get('/:id', aeh(async (req, res) => {
  const attributes = { exclude: ['contrasena', 'usuario'] };

  if (req.user.scope.indexOf('paciente') < 0) {
    const medico = await models.Medico.findOne({
      where: { idMedico: req.params.id },
      attributes,
    });
    if (medico) {
      res.send(medico.dataValues);
    } else res.status(404).send({ error: 'Medico no encontrado' });
  } else {
    const medico = await models.Cita.findOne({
      include: {
        where: { idMedico: req.params.id },
        model: models.Medico,
        attributes,
      },
      where: { idPaciente: req.user.idPaciente },
    });
    if (medico) {
      res.send(medico.dataValues.medico);
    } else res.status(404).send({ error: 'Medico no encontrado o permisos insuficientes' });
  }
}));

router.get('/:id/agenda', aeh(async (req, res) => {
  let disponibilidad = await models.Cita.findAll({
    where: { idMedico: req.params.id, estado: 'disponible' },
    attributes: ['fecha', 'hora'],
  });
  if (disponibilidad.length < 5) {
    try {
      disponibilidad = await models.Cita.programarCitas(models, req.params.id);
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message });
    }
  }
  disponibilidad = await models.Cita.findAll({
    where: { idMedico: req.params.id, estado: 'disponible' },
    attributes: ['fecha', 'hora'],
  });
  res.send({ disponibilidad: disponibilidad.map(horario => horario.dataValues) });
}));

export default router;
