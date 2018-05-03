import Sequelize from 'sequelize';

const dbName = process.env.PG_DB_NAME || 'medical';
const dbUser = process.env.PG_DB_USER || 'medical';
const dbPassword = process.env.PG_DB_PASSWORD || 'thescret';
const dbHost = process.env.PG_DB_HOST || 'localhost';
const dbPort = process.env.PG_DB_PORT || '5432';

const db = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: true,
  },
});

const Medico = require('./models/medico').default(db);
const Horario = require('./models/horario').default(db);
const Paciente = require('./models/paciente').default(db);
const Cita = require('./models/cita').default(db);

export const models = {
  Medico, Horario, Paciente, Cita,
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export async function initialize() {
  await db.authenticate();
  await db.sync();
  const [paciente] = await Paciente.findOrCreate({
    where: { numId: '00000000', tipoId: 'PP' },
    defaults: {
      tipoId: 'PP',
      numId: '00000000',
      nombres: 'Paciente',
      apellidos: 'Pruebas',
      contrasena: 'averyverysecretsecret',
      fechaNacimiento: new Date(2000, 1, 1),
      estado: 'activo',
      telefono: '00000000',
      correo: 'test@myemail.com',
      ciudad: 'Cali',
    },
  });
  const [medico] = await Medico.findOrCreate({
    where: { usuario: 'test' },
    defaults: {
      nombres: 'Medico',
      apellidos: 'Prueba',
      usuario: 'test',
      especialidad: 'Maniquí de Pruebas',
      contrasena: 'averyverysecretsecret',
      estado: 'activo',
      esAdmin: true,
    },
  });
  await Cita.findOrCreate({
    where: { comentario: 'Cita de prueba' },
    defaults: {
      fecha: Date.now(),
      hora: '08:00',
      duracion: 20,
      comentario: 'Cita de prueba',
      formulacion: '',
      observaciones: '',
      estado: 'atendida',
      idMedico: medico.dataValues.idMedico,
      idPaciente: paciente.dataValues.idPaciente,
    },
  });
  await Cita.findOrCreate({
    where: { comentario: 'Disponibilidad de prueba' },
    defaults: {
      fecha: Date.now(),
      hora: '08:20',
      duracion: 20,
      comentario: 'Disponibilidad de prueba',
      formulacion: '',
      observaciones: '',
      estado: 'disponible',
      idMedico: medico.dataValues.idMedico,
    },
  });
}

export default {
  db, initialize, models,
};
