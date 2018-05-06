import Sequelize from 'sequelize';
import moment from 'moment';

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
    estado: {
      type: Sequelize.ENUM('reservada', 'cancelada', 'atendida', 'disponible', 'no asistida'),
      allowNull: false,
      defaultValue: 'reservada',
    },
  });

  Cita.associate = ({ Medico, Paciente }) => {
    Cita.belongsTo(Medico, { foreignKey: 'idMedico' });
    Cita.belongsTo(Paciente, { foreignKey: 'idPaciente' });
  };

  Cita.programarCitas = async ({ Horario }, idMedico) => {
    const horarios = await Horario.findAll({
      where: { idMedico },
    });
    if (!horarios) {
      const error = new Error('El medico no tiene horarios definidos');
      error.status = 400;
      throw error;
    } else {
      await Promise.all(horarios.map(async (horario) => {
        console.log(horario.horaInicio);
        const timer = moment(horario.horaInicio, ['HH:mm:ss']);
        const horas = [];
        const fecha = moment().day(horario.dia).toDate();
        const fin = moment(horario.horaFin, ['HH:mm:ss']);
        while (timer.isBefore(fin)) {
          horas.push(timer.format('HH:mm'));
          timer.add(20, 'minutes');
        }
        await Promise.all(horas.map(async (hora) => {
          await Cita.findOrCreate({
            where: { hora, fecha, idMedico },
            defaults: {
              hora, fecha, duracion: 20, idMedico, estado: 'disponible',
            },
          });
        }));
      }));
    }
  };

  return Cita;
}
