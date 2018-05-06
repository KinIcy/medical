import Sequelize from 'sequelize';

export default function (db) {
  const Horario = db.define('horario', {
    idHorario: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    dia: { type: Sequelize.SMALLINT, allowNull: false },
    horaInicio: { type: Sequelize.TIME, allowNull: false },
    horaFin: { type: Sequelize.TIME, allowNull: false },
  });

  Horario.associate = ({ Medico }) => {
    Horario.belongsTo(Medico, { foreignKey: 'idMedico' });
  };

  return Horario;
}
