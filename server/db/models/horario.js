import Sequelize from 'sequelize';

export default function (db) {
  const Horario = db.define('horario', {
    idHorario: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    dia: { type: Sequelize.ENUM('L', 'M', 'X', 'J', 'V', 'S', 'D'), allowNull: false },
    horaInicio: { type: Sequelize.TIME, allowNull: false },
    horaFin: { type: Sequelize.TIME, allowNull: false },
  });

  Horario.associate = ({ Medico }) => {
    Horario.belongsTo(Medico, { foreignKey: 'idMedico' });
  };

  return Horario;
}
