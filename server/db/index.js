import Sequelize from 'sequelize';

const dbName = process.env.PG_DB_NAME || 'medical';
const dbUser = process.env.PG_DB_USER || 'medical';
const dbPassword = process.env.PG_DB_PASSWORD || 'thescret';
const dbHost = process.env.PG_DB_HOST || 'localhost';

const db = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'postgres',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const Paciente = require('./paciente');
const Horario = require('./horario');
const Medico = require('./medico');
const Cita = require('./cita');

async function initializeDB() {
  await db.authenticate();
  await db.sync();
}

export default {
  db, initializeDB, Paciente, Horario, Medico, Cita,
};
