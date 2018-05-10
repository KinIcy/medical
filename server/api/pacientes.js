import { Router } from 'express';
import crypto from 'crypto';

import { models } from '../db';

import aeh from '../async-error-handler';

const router = Router();

router.post('/', aeh(async (req, res) => {
  if (req.user.scope.indexOf('paciente') >= 0) {
    res.status(401).send({ error: 'No tienes permisos para realizar esta acción' });
  } else if (!req.body.nombres || !req.body.apellidos || !req.body.numId ||
    !req.body.fechaNacimiento || !req.body.telefono || !req.body.correo ||
    !req.body.ciudad || !req.body.tipoId
  ) {
    res.status(400).send({ error: 'Por favor verifique que todos los campos han sido dilegenciados correctamente' });
  } else if (await models.Paciente.findOne({
    where: { numId: req.body.numId, tipoId: req.body.tipoId },
  })) {
    res.status(400).send({ error: 'Ya existe un paciente registrado con mismo documento de identiidad' });
  } else {
    await models.Paciente.create({
      tipoId: req.body.tipoId,
      numId: req.body.numId,
      nombres: req.body.nombres,
      apellidos: req.body.apellidos,
      fechaNacimiento: req.body.fechaNacimiento,
      telefono: req.body.telefono,
      correo: req.body.correo,
      ciudad: req.body.ciudad,
      contrasena: crypto.randomBytes(20).toString('hex'),
    });
    res.status(201).send({ status: 'OK' });
  }
}));

router.get('/', aeh(async (req, res) => {
  if (req.user.scope.indexOf('paciente') >= 0) {
    res.status(401).send({ error: 'No tienes permisos para ver este contenido' });
  } else {
    const pacientes = await models.Paciente.findAll({
      attributes: ['tipoId', 'numId', 'nombres', 'estado'],
    });
    res.send({ pacientes: pacientes.filter(paciente => paciente.dataValues) });
  }
}));

router.put('/:id', aeh(async (req, res) => {
  if (req.user.scope.indexOf('paciente') >= 0 && (req.user.idPaciente !== req.params.id)) {
    res.status(401).send({ error: 'No tienes permisos para realizar esta acción.' });
  } else {
    await models.Paciente.editarPaciente({
      idPaciente: req.body.idPaciente,
      telefono: req.body.telefono,
      correo: req.body.correo,
      ciudad: req.body.ciudad,
    });
    res.status.send({ status: 'OK' });
  }
}));

router.get('/:id', aeh(async (req, res) => {
  if (req.user.scope.indexOf('paciente') >= 0) {
    res.status(401).send({ error: 'No tienes permisos para ver este contenido' });
  } else {
    const paciente = await models.Paciente.findOne({
      where: { tipoId: req.params.id.substring(0, 2), numId: req.params.id.substring(2) },
      attributes: { exclude: ['constrasena'] },
    });
    if (paciente) {
      res.send(paciente.dataValues);
    } else res.status(404).send({ error: 'Paciente no encontrado' });
  }
}));

router.get('/historial', aeh(async (req, res) => {
  if (req.user.scope.indexOf('paciente') < 0) {
    res.status(401).send({ error: 'Es necesario iniciar sesión como paciente' });
  } else {
    const citas = await models.Cita.findAll({
      where: { idPaciente: req.user.idPaciente, estado: 'atendida' },
    });
    res.send({ citas: citas.filter(cita => cita.dataValues) });
  }
}));

router.get('/:id/historial', aeh(async (req, res) => {
  if (req.user.scope.indexOf('paciente') >= 0) {
    res.status(401).send({ error: 'No tienes permisos para ver este contenido' });
  } else {
    const { idPaciente } = await models.Paciente.findOne({
      where: { tipoId: req.params.id.substring(0, 2), numId: req.params.id.substring(2) },
      attributes: ['idPaciente'],
    });
    if (idPaciente === undefined) {
      res.status(404).send({ error: 'Paciente no encontrado' });
    } else {
      const citas = await models.Cita.findAll({
        where: { idPaciente, estado: 'atendida' },
      });
      res.send({ citas: citas.filter(cita => cita.dataValues) });
    }
  }
}));


export default router;
