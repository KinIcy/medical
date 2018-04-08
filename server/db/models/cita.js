import Sequelize from 'sequelize';

export default function (db) {
  const Cita = db.define('cita', {
    fecha: { type: Sequelize.DATEONLY, allowNull: false },
    hora: { type: Sequelize.TIME, allowNull: false },
    duracion: { type: Sequelize.INTEGER, allowNull: false },
    comentario: { type: Sequelize.TEXT },
    formulacion: { type: Sequelize.TEXT },
    observaciones: { type: Sequelize.TEXT },
    estado: { type: Sequelize.ENUM('pendiente', 'cancelada', 'atendida'), allowNull: false, defaultValue: 'pendiente' },
  }, {
    classMethods: {
      associate({ Medico, Paciente }) {
        Cita.hasOne(Medico);
        Cita.hasOne(Paciente);
      },
    },
  });

  return Cita;
}
