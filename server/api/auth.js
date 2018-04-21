import { Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { models } from '../db';

const secret = 'dummy' || process.env.SECRET;
const router = Router();

router.post('/login', async (req, res) => {
//res.status(400).send({ error: 'Nombre de usuario invalido' });

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
      attributes: ['tipoId', 'numId', 'nombres', 'apellidos'],
    });
    if (!paciente) {
      res.status(404).send({ error: 'Combinación de usuario y contraseña invalida, o usuario inactivo' });
    } else {
      accessToken = jsonwebtoken.sign(Object.assign(paciente, { scope: ['paciente'] }, secret));
    }
  } else if (tipo === 'medico') {
    const medico = await models.Paciente.findOne({
      where: { usuario, contrasena, estado: 'activo' },
      attributes: ['nombres', 'apellidos', 'esAdmin'],
    });
    if (!medico) {
      res.status(404).send({ error: 'Combinación de usuario y contraseña invalida, o usuario inactivo' });
    } else {
      accessToken = jsonwebtoken.sign(Object.assign(medico, { scope: [medico.esAdmin ? 'admin' : 'medico'] }, secret));
    }
  } else res.status(400).send({ error: 'Tipo de acceso invalido' });
  if (accessToken) {
    res.json({ token: accessToken });
  } else {
    res.status(500).send({ error: 'Algo inesperado ocurrió ' });
  }
});

router.get('/user', (req, res) => {
  res.json(req.user);
});

router.post('/logout', (req, res) => {
  res.json({ status: 'OK' });
});

export default router;
