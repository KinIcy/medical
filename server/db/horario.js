import Sequelize from 'sequelize';

import { db } from './';
import Medico from './medico';

const Horario = db.define('horario', {
  fecha: { type: Sequelize.DATEONLY, allowNull: false },
  horaInicio: { type: Sequelize.TIME, allowNull: false },
  horaFin: { type: Sequelize.TIME, allowNull: false },
});

Horario.belongsTo(Medico);

export default Horario;
