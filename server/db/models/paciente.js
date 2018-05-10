import Sequelize from 'sequelize';

export default function (db) {
  const Paciente = db.define('paciente', {
    idPaciente: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tipoId: { type: Sequelize.ENUM('CC', 'TI', 'PP', 'CE', 'RC'), allowNull: false, unique: 'identificacion' },
    numId: { type: Sequelize.CHAR(10), allowNull: false, unique: 'identificacion' },
    nombres: { type: Sequelize.STRING(50), allowNull: false },
    apellidos: { type: Sequelize.STRING(50), allowNull: false },
    contrasena: { type: Sequelize.STRING(100), allowNull: false },
    fechaNacimiento: { type: Sequelize.DATEONLY, allowNull: false },
    estado: { type: Sequelize.ENUM('activo', 'inactivo'), allowNull: false, defaultValue: 'activo' },
    telefono: { type: Sequelize.STRING(13), allowNull: false },
    correo: { type: Sequelize.STRING(100), allowNull: false },
    direccion: { type: Sequelize.STRING(60), default: '' },
    ciudad: { type: Sequelize.STRING(20), allowNull: false },
  });

  Paciente.associate = ({ Cita }) => {
    Paciente.hasMany(Cita, { foreignKey: 'idPaciente' });
  };

  Paciente.editarPaciente = async (pPaciente) => {
    const paciente = await Paciente.findOne({
      where: { idPaciente: pPaciente.idPaciente },
    });
    if (!paciente) {
      const error = new Error('No existe el paciente.');
      error.status = 404;
      throw error;
    } else {
      const [updateCount] = await Paciente.update({
        telefono: pPaciente.telefono,
        correo: pPaciente.correo,
        ciudad: pPaciente.ciudad,
      }, {
        where: { idPaciente: pPaciente.idPaciente },
      });
      if (!updateCount) {
        const error = new Error('Ocurrió un error al intentar actualizar los datos del Paciente.');
        error.status = 500;
        throw error;
      }
    }
  };

  return Paciente;
}
