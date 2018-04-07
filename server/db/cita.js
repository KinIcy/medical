import Sequelize from 'sequelize';

import { db } from './';
import Medico from './medico';
import Paciente from './paciente';

const Cita = db.define('cita', {
  fecha: { type: Sequelize.DATEONLY, allowNull: false },
  hora: { type: Sequelize.TIME, allowNull: false },
  duracion: { type: Sequelize.INTEGER, allowNull: false },
  comentario: { type: Sequelize.TEXT },
  formulacion: { type: Sequelize.TEXT },
  observaciones: { type: Sequelize.TEXT },
  estado: { type: Sequelize.ENUM('pendiente', 'cancelada', 'atendida'), allowNull: false, defaultValue: 'pendiente' },
});

Cita.hasOne(Medico);
Cita.hasOne(Paciente);

export default Cita;
