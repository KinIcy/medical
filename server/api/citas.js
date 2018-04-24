import { Router } from 'express';
import Sequelize from 'sequelize';

import { models } from '../db';
import aeh from '../async-error-handler';

const router = Router();

router.post('/', aeh(async (req, res) => {
  if (!req.body.fecha.length || !req.body.hora.length || !req.body.idMedico.length) {
    res.status(400).send({ error: 'Por favor diligenciar todos los campos obligatorios' });
  } else if (!(await models.Medico.findById(req.body.idMedico))) {
    res.status(400).send({ error: 'Medico invalido' });
  } else {
    const cita = await models.Cita.findOne({
      where: {
        idMedico: req.body.idMedico,
        fecha: req.body.fecha,
        hora: req.body.hora,
        estado: 'disponible',
      },
      attributes: ['idCita'],
    });
    if (!cita) {
      res.status(400).send({ error: 'El medico no está disponible en la fecha y horario elegidos' });
    } else {
      let idPaciente;
      if (req.user.scope.indexOf('paciente') >= 0) {
        ({ idPaciente } = req.user);
      } else {
        ({ idPaciente } = req.body);
      }
      if (!idPaciente) {
        res.status(400).send({ error: 'Paciente invalido' });
      } else {
        const [updateCount] = await models.Cita.update({
          idPaciente,
          estado: 'reservada',
          comentario: req.body.comentario || '',
        }, {
          where: { idCita: cita.idCita },
        });
        if (updateCount !== 2) {
          res.status(500).send({ error: 'Ocurrió un error al crear la cita' });
        } else res.send({ status: 'OK' });
      }
    }
  }
}));

router.get('/', aeh(async (req, res) => {
  let citas;
  if (req.user.scope.indexOf('paciente') >= 0) {
    citas = await models.Cita.findAll({
      where: {
        idPaciente: req.user.idPaciente,
        estado: { [Sequelize.Op.ne]: 'disponible' },
      },
      include: {
        model: models.Medico,
        attributes: ['nombres', 'apellidos'],
      },
    });
  } else if (req.user.scope.indexOf('medico') >= 0) {
    citas = await models.Cita.findAll({
      where: {
        idMedico: req.user.idMedico,
        estado: { [Sequelize.Op.ne]: 'disponible' },
      },
      include: {
        model: models.Paciente,
        attributes: ['nombres', 'apellidos'],
      },
    });
  } else {
    citas = await models.Cita.findAll({
      where: {
        estado: { [Sequelize.Op.ne]: 'disponible' },
      },
      include: [{
        model: models.Paciente,
        attributes: ['nombres', 'apellidos'],
      }, {
        model: models.Medico,
        attributes: ['nombres', 'apellidos'],
      }],
    });
  }
  res.send({ citas: citas.filter(cita => cita.dataValues) });
}));

export default router;
