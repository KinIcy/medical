import Sequelize from 'sequelize';

export default function (db) {
  const Horario = db.define('horario', {
    idHorario: {
      type: Sequelize.TINYINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    dia: { type: Sequelize.ENUM('L', 'M', 'X', 'J', 'V', 'S', 'D'), allowNull: false },
    horaInicio: { type: Sequelize.TIME, allowNull: false },
    horaFin: { type: Sequelize.TIME, allowNull: false },
  }, {
    classMethods: {
      associate({ Medico }) {
        Horario.belongsTo(Medico);
      },
    },
  });


  return Horario;
}
