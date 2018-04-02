import Sequelize from 'sequelize';

import { db } from './index';

const Medico = db.define('medico', {
  nombres: { type: Sequelize.STRING(50), allowNull: false },
  apellidos: { type: Sequelize.STRING(50), allowNull: false },
  usuario: { type: Sequelize.STRING(30), allowNull: false, unique: true },
  especialidad: { type: Sequelize.STRING(50), allowNull: false },
  contrasena: { type: Sequelize.STRING(100), allowNull: false },
  estado: { type: Sequelize.ENUM('activo', 'inactivo'), allowNull: false, defaultValue: 'activo' },
});

export default Medico;
