import { Router } from 'express';
import Sequelize from 'sequelize';
import moment from 'moment';

import { models } from '../db';
import aeh from '../async-error-handler';

const router = Router();

router.post('/', aeh(async (req, res) => {
  if (!req.body.fecha || !req.body.hora || !req.body.idMedico) {
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
        if (!updateCount) {
          res.status(500).send({ error: 'Ocurrió un error al reservar la cita' });
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
  } else if (req.query.global === undefined) {
    const fecha = moment();
    fecha.year(req.query.ano);
    fecha.week(req.query.semana);
    fecha.day(1);
    const inicio = fecha.toDate();
    fecha.day(7);
    const fin = fecha.toDate();
    citas = await models.Cita.findAll({
      where: {
        idMedico: req.user.idMedico,
        fecha: {
          [Sequelize.Op.and]: {
            [Sequelize.Op.gte]: inicio,
            [Sequelize.Op.lte]: fin,
          },
        },
      },
      include: {
        model: models.Paciente,
        attributes: ['nombres', 'apellidos'],
      },
    });
  } else if (req.user.scope.indexOf('admin') >= 0) {
    citas = await models.Cita.findAll({
      include: [{
        model: models.Paciente,
        attributes: ['nombres', 'apellidos'],
      }, {
        model: models.Medico,
        attributes: ['nombres', 'apellidos'],
      }],
    });
  } else {
    res.status(401).send({ error: 'No tienes permisos para ver este contenido' });
  }
  if (citas) res.send({ citas: citas.map(cita => cita.dataValues) });
}));

router.get('/:id', aeh(async (req, res) => {
  const cita = await models.Cita.findById(req.params.id, {
    include: [{
      model: models.Paciente,
      attributes: ['nombres', 'apellidos', 'tipoId', 'numId'],
    }],
  });
  if (!cita) {
    res.status(404).send({ error: 'No se encontra la cita' });
  } else if (req.user.scope.indexOf('admin') < 0 && req.user.idPaciente !== cita.idPaciente && req.user.idMedico !== cita.idMedico) {
    res.status(401).send({ error: 'No tienes permiso para ver este contenido' });
  } else {
    res.send({ cita });
  }
}));

router.put('/:id', aeh(async (req, res) => {
  const { noAsistida, observaciones, formulacion } = req.body;
  if (req.user.scope.indexOf('paciente') >= 0) {
    res.status(401).send({ error: 'No tienes permisos para realizar esta acción' });
  } else {
    const cita = await models.Cita.findById(req.params.id);
    if (!cita) {
      res.status(404).send({ error: 'Cita no encontrada' });
    } else if (cita.dataValues.estado !== 'reservada') {
      res.status(400).send({ error: 'No puedes alterar una cita con un estado diferente a reservada' });
    } else if (noAsistida) {
      const [updateCount] = await models.Cita.update({
        estado: 'no asistida',
      }, {
        where: { idCita: cita.idCita },
      });
      if (!updateCount) {
        res.status(500).send({ error: 'Ocurrio un error al actualizar la cita' });
      } else {
        res.send({ status: 'OK' });
      }
    } else {
      const [updateCount] = await models.Cita.update({
        estado: 'atendida',
        observaciones,
        formulacion,
      }, {
        where: { idCita: cita.idCita },
      });
      if (!updateCount) {
        res.status(500).send({ error: 'Ocurrio un error al actualizar la cita' });
      } else {
        res.send({ status: 'OK' });
      }
    }
  }
}));

router.delete('/:id', aeh(async (req, res) => {
  const cita = await models.Cita.findOne({
    where: { idCita: req.params.id },
  });
  if (!cita) {
    res.status(404).send({ error: 'Cita no encontrada' });
  } else if (req.user.scope.indexOf('paciente') >= 0 && cita.idPaciente !== req.user.idPaciente) {
    res.status(401).send({ error: 'No tienes permisos para realizar esta acción' });
  } else if (cita.estado === 'reservada') {
    const [updateCount] = await models.Cita.update({
      estado: 'cancelada',
    }, {
      where: { idCita: req.params.id },
    });
    if (!updateCount) {
      res.status(500).send({ error: 'Ocurrio un error al actualizar la cita' });
    } else {
      res.send({ status: 'OK' });
    }
  } else if (cita.estado === 'disponible') {
    const destrouCount = await models.Cita.destroy({
      where: { idCita: req.params.id },
    });
    if (!destrouCount) {
      res.status(500).send({ error: 'Ocurrio un error al eliminar la cita' });
    } else res.send({ status: 'OK' });
  } else {
    res.status(400).send({ error: 'No puedes cancelar una cita que no esté reservada, o ya esté cancelada o atendida' });
  }
}));

export default router;
