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

  await Medico.findOrCreate({
    where: { usuario: 'Medical' },
    defaults: {
      nombres: 'Medical',
      apellidos: 'Admin',
      usuario: 'Medical',
      especialidad: 'Admin de Medical',
      contrasena: 'averyverysecretsecret',
      estado: 'activo',
      esAdmin: true,
    },
  });
}

export default {
  db, initialize, models,
};
