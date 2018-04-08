import Sequelize from 'sequelize';

export default function (db) {
  const Horario = db.define('horario', {
    fecha: { type: Sequelize.DATEONLY, allowNull: false },
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
