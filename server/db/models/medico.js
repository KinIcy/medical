import Sequelize from 'sequelize';

export default function (db) {
  const Medico = db.define('medico', {
    idMedico: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nombres: { type: Sequelize.STRING(50), allowNull: false },
    apellidos: { type: Sequelize.STRING(50), allowNull: false },
    usuario: { type: Sequelize.STRING(30), allowNull: false, unique: true },
    especialidad: { type: Sequelize.STRING(50), allowNull: false },
    contrasena: { type: Sequelize.STRING(100), allowNull: false },
    estado: { type: Sequelize.ENUM('activo', 'inactivo'), allowNull: false, defaultValue: 'activo' },
    esAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  });

  return Medico;
}
