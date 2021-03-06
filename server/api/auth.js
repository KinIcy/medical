import { Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { models } from '../db';
import aeh from '../async-error-handler';

const secret = 'dummy' || process.env.SECRET;
const router = Router();

router.post('/login', aeh(async (req, res) => {
  const { tipo, usuario, contrasena } = req.body;
  let accessToken;
  if (!usuario || usuario.length < 3) {
    res.status(400).send({ error: 'Nombre de usuario invalido' });
  } else if (!contrasena || contrasena.length < 8) {
    res.status(400).send({ error: 'Contraseña invalida' });
  } else if (tipo === 'paciente') {
    const paciente = await models.Paciente.findOne({
      where: {
        tipoId: usuario.substr(0, 2),
        numId: usuario.substr(2),
        contrasena,
        estado: 'activo',
      },
      attributes: { exclude: ['contrasena'] },
    });
    if (!paciente) {
      res.status(404).send({ error: 'Combinación de usuario y contraseña invalida, o usuario inactivo' });
    } else {
      accessToken = jsonwebtoken.sign(Object.assign(paciente.dataValues, { scope: ['paciente'] }), secret);
    }
  } else if (tipo === 'medico') {
    const medico = await models.Medico.findOne({
      where: { usuario, contrasena, estado: 'activo' },
      attributes: ['nombres', 'apellidos', 'esAdmin', 'idMedico'],
    });
    if (!medico) {
      res.status(404).send({ error: 'Combinación de usuario y contraseña invalida, o usuario inactivo' });
    } else {
      accessToken = jsonwebtoken.sign(Object.assign(medico.dataValues, { scope: [medico.esAdmin ? 'admin' : 'medico'] }), secret);
    }
  } else {
    res.status(400).send({ error: 'Tipo de acceso invalido' });
  }
  if (accessToken) {
    res.json({ token: accessToken });
  }
}));

router.get('/user', (req, res) => {
  res.json({ user: req.user });
});

router.post('/logout', (req, res) => {
  res.json({ status: 'OK' });
});

export default router;
