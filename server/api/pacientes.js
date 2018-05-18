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
    const { numId, tipoId } = req.query;
    const pacientes = await models.Paciente.findAll({
      attributes: { exclude: ['contrasena'] },
      where: numId && tipoId ? { numId, tipoId } : undefined,
    });
    if (!pacientes.length) {
      res.status(404).send({ error: 'No se encontro pacientes con los parametros especificados' });
    } else res.send({ pacientes: pacientes.filter(paciente => paciente.dataValues) });
  }
}));

router.put('/:id', aeh(async (req, res) => {
  if (req.user.scope.indexOf('paciente') >= 0 && (req.user.idPaciente !== req.params.id)) {
    res.status(401).send({ error: 'No tienes permisos para realizar esta acción.' });
  } else {
    try {
      await models.Paciente.editarPaciente({
        idPaciente: req.params.id,
        telefono: req.body.telefono,
        correo: req.body.correo,
        direccion: req.body.direccion,
        ciudad: req.body.ciudad,
      });
      res.send({ status: 'OK' });
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message });
    }
  }
}));

router.get('/:id', aeh(async (req, res) => {
  if (req.user.scope.indexOf('paciente') >= 0 && req.user.idPaciente !== req.params.id) {
    res.status(401).send({ error: 'No tienes permisos para ver este contenido' });
  } else {
    const paciente = await models.Paciente.findOne({
      where: { idPaciente: req.params.id },
      attributes: { exclude: ['constrasena'] },
    });
    if (paciente) {
      res.send(paciente.dataValues);
    } else res.status(404).send({ error: 'Paciente no encontrado' });
  }
}));

router.get('/:id/historial', aeh(async (req, res) => {
  if (req.user.scope.indexOf('paciente') >= 0 && req.user.idPaciente !== req.params.id) {
    res.status(401).send({ error: 'No tienes permisos para ver este contenido' });
  } else {
    const citas = await models.Cita.findAll({
      where: { idPaciente: req.params.id, estado: 'atendida' },
      include: {
        model: models.Medico,
        attributes: ['nombres', 'apellidos'],
      },
      attributes: ['fecha', 'observaciones', 'formulacion'],
    });
    res.send({ citas });
  }
}));


export default router;
