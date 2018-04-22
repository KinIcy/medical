import Sequelize from 'sequelize';

export default function (db) {
  const Cita = db.define('cita', {
    idCita: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: { type: Sequelize.DATEONLY, allowNull: false },
    hora: { type: Sequelize.TIME, allowNull: false },
    duracion: { type: Sequelize.INTEGER, allowNull: false },
    comentario: { type: Sequelize.TEXT },
    formulacion: { type: Sequelize.TEXT },
    observaciones: { type: Sequelize.TEXT },
    estado: { type: Sequelize.ENUM('reservada', 'cancelada', 'atendida', 'disponible'), allowNull: false, defaultValue: 'reservada' },
  });

  Cita.associate = ({ Medico, Paciente }) => {
    Cita.belongsTo(Medico, { foreignKey: 'idMedico' });
    Cita.belongsTo(Paciente, { foreignKey: 'idPaciente' });
  };

  return Cita;
}
