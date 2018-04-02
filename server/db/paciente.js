import Sequelize from 'sequelize';

import { db } from './index';

const Paciente = db.define('paciente', {
  tipoId: { type: Sequelize.ENUM('CC', 'TI', 'PP', 'CE', 'RC'), allowNull: false, unique: 'identificacion' },
  numId: { type: Sequelize.CHAR(10), allowNull: false, unique: 'identificacion' },
  nombres: { type: Sequelize.STRING(50), allowNull: false },
  apellidos: { type: Sequelize.STRING(50), allowNull: false },
  contrasena: { type: Sequelize.STRING(100), allowNull: false },
  fechaNacimiento: { type: Sequelize.DATEONLY, allowNull: false },
  estado: { type: Sequelize.ENUM('activo', 'inactivo'), allowNull: false, defaultValue: 'activo' },
  telefono: { type: Sequelize.STRING(13), allowNull: false },
  correo: { type: Sequelize.STRING(100), allowNull: false },
  ciudad: { type: Selection.STRING(20), allowNull: false },
});

export default Paciente;
