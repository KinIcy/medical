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
  res.send({ citas: citas.map(cita => cita.dataValues) });
}));

router.put('/:id', aeh(async (req, res) => {
  const { noAsistida, observaciones, formulacion } = req.body;
  if (req.user.scope.indexOf('paciente') >= 0) {
    res.status(401).send({ error: 'No tienes permisos para realizar esta acción' });
  } else {
    const cita = await models.Cita.findById(req.params.id);
    if (!cita) {
      res.status(404).send({ error: 'Cita no encontrada' });
    } else if (cita.dataValues.estado !== 'reservado') {
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
  if (req.user.scope.indexOf('paciente') >= 0) {
    const cita = await models.findOne({
      where: { idCita: req.params.id },
    });
    if (!cita) {
      res.status(404).send({ error: 'Cita no encontrada' });
    } else if (cita.idPaciente !== req.user.idPaciente) {
      res.status(401).send({ error: 'No tienes permisos para realizar esta acción' });
    } else if (cita.estado !== 'reservada') {
      res.status(400).send({ error: 'No puedes cancelar una cita que no esté reservada, o ya esté cancelada o atendida' });
    } else {
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
    }
  }
}));

export default router;
