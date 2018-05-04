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


  async function createPatient(
    pnumId, ptipoId, pnombres, papellidos, pcontrasena, pestado,
    ptelefono, pcorreo, pciudad,
  ) {
    await Paciente.findOrCreate({
      where: { numId: pnumId, tipoId: ptipoId },
      defaults: {
        tipoId: ptipoId,
        numId: pnumId,
        nombres: pnombres,
        apellidos: papellidos,
        contrasena: pcontrasena,
        fechaNacimiento: new Date(2000, 1, 1),
        estado: pestado,
        telefono: ptelefono,
        correo: pcorreo,
        ciudad: pciudad,
      },
    });
  }

  async function createMedical(puser, pnombres, papellidos, pespecialidad, pcontrasena, pestado) {
    await Medico.findOrCreate({
      where: { usuario: puser },
      defaults: {
        nombres: pnombres,
        apellidos: papellidos,
        usuario: puser,
        especialidad: pespecialidad,
        contrasena: pcontrasena,
        estado: pestado,
        esAdmin: true,
      },
    });
  }

  async function createCita(
    pfecha,
    phora, pduracion, pcomentario, pestado, pidMedico, pidPaciente,
  ) {
    await Cita.findOrCreate({
      where: { comentario: pcomentario },
      defaults: {
        fecha: pfecha,
        hora: phora,
        duracion: pduracion,
        comentario: pcomentario,
        formulacion: '',
        observaciones: '',
        estado: pestado,
        idMedico: pidMedico,
        idPaciente: pidPaciente,
      },
    });
  }


  // Se crean datos de prueba...
  await createPatient(
    '11111111', 'PP', 'María Laura', 'Diaz Lunas', '9999999999', 'activo',
    '5555555555', 'mdiaz@gmail.com', 'Cali',
  );

  await createPatient(
    '22222222', 'PP', 'Henry', ' Laus Hyins', '9999999999', 'activo',
    '5555555555', 'hlaus@gmail.com', 'Cali',
  );

  await createPatient(
    '33333333', 'PP', 'Florencia', 'Frachia', '9999999999', 'activo',
    '5555555555', 'ffrachia@gmail.com', 'Cali',
  );

  await createMedical('DIEGO.FUENTES', 'Diego', 'Fuentez', 'Cardiologo', '999999999', 'activo');
  await createMedical('JUAN.LUZ', 'Juan', 'Luz', 'Cardiologo', '999999999', 'activo');
  await createMedical('DIANA.RIOS', 'Diana María', 'Rios', 'Neurologo', '999999999', 'activo');
  await createMedical('JOSE.BENAVIDEZ', 'Jose', 'Benaviez', 'General', '999999999', 'activo');
  await createMedical('PALOMA.SAMBUSSI', 'Paloma', 'Sambussi', 'General', '999999999', 'activo');
  await createMedical('LISA.DELBOSQUE', 'Lisa', 'Del Bosque', 'General', '999999999', 'activo');
  await createMedical('ARIEL.PEREZ', 'Ariel', 'Perez', 'General', '999999999', 'activo');
  await createMedical('ALVARO.SUSQUI', 'Álvaro', 'Susqui', 'General', '999999999', 'activo');
  await createMedical('LILY.ASQUI', 'Lily', 'Asqui', 'General', '999999999', 'activo');
  await createMedical('TOM.SUIEZ', 'Tom', 'Suiez', 'General', '999999999', 'activo');
  await createMedical('URBELO.NANO', 'Urbelo', 'Nano', 'General', '999999999', 'activo');
  await createMedical('SUAD.TELLO', 'Suad', 'Tello', 'General', '999999999', 'activo');
  await createMedical('HENRY.DIAZ', 'Hendry', 'Dias', 'General', '999999999', 'activo');
  await createMedical('TOM.SUIEZ', 'Tom', 'Suiez', 'General', '999999999', 'activo');
  await createMedical('ANA.REY', 'Ana María', 'Rey', 'Cardiologo', '999999999', 'activo');
}

export default {
  db, initialize, models,
};
