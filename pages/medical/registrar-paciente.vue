<template>
  <div>
    <card class="login-card">
      <h3 slot="header" class="title text-center">Registrar Paciente</h3>
      <form @submit.prevent="OnSumbit">
        <template>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <select class="custom-select" v-model="tipoId">
              <option value="" selected>Tipo de Identificación</option>
              <option value="CC">Cedula de Ciudadanía</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="PP">Pasaporte</option>
              <option value="RC">Registro Civil</option>
              <option value="CE">Cedula Extranjera</option>
            </select>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="numId" type="text" class="form-control" placeholder="Numero de Identificacion">
          </div>

          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-key"></i>
              </span>
            </div>
            <input v-model="contrasena" type="password" class="form-control" placeholder="Contraseña" >
          </div>

          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="nombres" type="text" class="form-control" placeholder="Nombres">
          </div>

          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="apellidos" type="text" class="form-control" placeholder="Apellidos">
          </div>

          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="fechaNacimiento" type="date" class="form-control" placeholder="Fecha de Nacimeinto">
          </div>

          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="telefono" type="text" class="form-control" placeholder="Teléfono">
          </div>

          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="Ciudad" type="text" class="form-control" placeholder="Ciudad">
          </div>

          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="direccion" type="text" class="form-control" placeholder="Dirección">
          </div>

          <div class="input-group">
            <radio v-model="estado" label="activo">Activo</radio>
            <radio v-model="estado" label="inactivo">Inactivo</radio>
          </div>

        </template>
        <button class="btn btn-primary btn-block" type="submit">Crear Paciente</button>
      </form>
    </card>
  </div>
</template>

<script>
import Card from '~/components/Cards/Card.vue';
import Radio from '~/components/Inputs/Radio.vue';

export default {
  layout: 'default',
  components: { Card, Radio },
  data() {
    return {
      tipo: 'paciente',
      tipoId: '',
      numId: '',
      contrasena: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: '',
      telefono: '',
      ciudad: '',
      direccion: '',
    };
  },
  methods: {
    async OnSumbit() {
      try {
        const token = 'Bearer  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFBhY2llbnRlIjoiMSIsInRpcG9JZCI6IlBQIiwibnVtSWQiOiIwMDAwMDAwMCAgIiwibm9tYnJlcyI6IlBhY2llbnRlIiwiYXBlbGxpZG9zIjoiUHJ1ZWJhcyIsImZlY2hhTmFjaW1pZW50byI6IjIwMDAtMDItMDEiLCJlc3RhZG8iOiJhY3Rpdm8iLCJ0ZWxlZm9ubyI6IjU1NSA1NTUgNTU1IDUiLCJjb3JyZW8iOiJwcmV1YmFAcHJldWJhLmNvbSIsImNpdWRhZCI6IkNhbGkiLCJjcmVhdGVkQXQiOiIyMDE4LTA1LTA1VDIzOjM4OjA1LjE3OFoiLCJ1cGRhdGVkQXQiOiIyMDE4LTA1LTA3VDIzOjA1OjM5LjAwN1oiLCJzY29wZSI6WyJwYWNpZW50ZSJdLCJpYXQiOjE1MjU4NDU2NjF9.84LT2U85KkOqW6tEgGoTj0Y9hzxYgBkhHbYVt9r_6sk';
        await this.$http.post('https://puj-medical.herokuapp.com/api/pacientes', {
          data: {
            tipoId: this.tipo,
            numId: this.numId,
            contrasena: this.contrasena,
            nombres: this.nombres,
            apellidos: this.apellidos,
            fechaNacimiento: this.fechaNacimiento,
            ciudad: this.ciudad,
            direccion: this.direccion,
          },
        }, { headers: { Autorization: token } }).then((data) => {
          console.log(data);
        });
        this.$router.replace({ path: '/medical/' });
      } catch (error) {
        const errorMessage = error.response ? error.response.data.error : error.message;
        console.log(errorMessage);
        this.$notify({
          message: `${errorMessage}`,
          icon: 'fa fa-times',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'danger',
        });
      }
    },
  },
};
</script>
<style>

  .login-card {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
