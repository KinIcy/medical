import { Router } from 'express';

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

export default router;
