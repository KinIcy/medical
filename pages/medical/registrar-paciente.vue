<template>
  <div class="content">
    <div class="container-fluid">
      <card class="registrar-paciente-card">
        <h4 slot="header" class="card-title">{{titleText}}</h4>
        <form @submit.prevent="OnSumbit">
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <select class="custom-select" v-model="tipoId" :disabled="disableVar">
              <option value="" selected disabled>Tipo de Identificación</option>
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
            <input v-model="numId" type="text" class="form-control" placeholder="Numero de Identificacion" :disabled="disableVar" required>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="nombres" type="text" class="form-control" placeholder="Nombres" :disabled="disableVar" required>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="apellidos" type="text" class="form-control" placeholder="Apellidos" :disabled="disableVar" required>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="fechaNacimiento" type="date" class="form-control" placeholder="Fecha de Nacimeinto" :disabled="disableVar" required>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="telefono" type="text" class="form-control" placeholder="Teléfono" required>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="ciudad" type="text" class="form-control" placeholder="Ciudad" required>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="correo" type="email" class="form-control" placeholder="Correo Electrónico" required>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="direccion" type="text" class="form-control" placeholder="Dirección">
          </div>
          <button class="btn btn-primary mr-2" type="submit" type="button"> {{ submitText }} </button>
          <button class="btn btn-secundary" @click="cancel" type="button">Cancelar</button>
        </form>
      </card>
    </div>
  </div>
</template>

<script>
import Card from '~/components/Cards/Card.vue';

export default {
  layout: 'default',
  components: { Card },
  async asyncData({ app, query }) {
    if (!query.idPaciente) {
      const tipoId = '';
      const numId = '';
      const nombres = '';
      const apellidos = '';
      const fechaNacimiento = '';
      const telefono = '';
      const ciudad = '';
      const direccion = '';
      const correo = '';
      const queryParam = '';
      const disableVar = false;
      const submitText = 'Registar paciente';
      const titleText = 'Registar paciente';
      return {
        tipoId,
        numId,
        nombres,
        apellidos,
        fechaNacimiento,
        telefono,
        ciudad,
        direccion,
        correo,
        queryParam,
        disableVar,
        submitText,
        titleText,
      };
    }
    const paciente = await app.$axios.$get(`pacientes/${query.idPaciente}`);
    const tipoId = `${paciente.tipoId}`;
    const numId = `${paciente.numId}`;
    const nombres = `${paciente.nombres}`;
    const apellidos = `${paciente.apellidos}`;
    const fechaNacimiento = `${paciente.fechaNacimiento}`;
    const telefono = `${paciente.telefono}`;
    const ciudad = `${paciente.ciudad}`;
    const direccion = `${paciente.direccion}`;
    const correo = `${paciente.correo}`;
    const queryParam = `${query.idPaciente}`;
    const disableVar = true;
    const submitText = 'Actualizar paciente';
    const titleText = 'Actualizar paciente';
    return {
      tipoId,
      numId,
      nombres,
      apellidos,
      fechaNacimiento,
      telefono,
      ciudad,
      direccion,
      correo,
      queryParam,
      disableVar,
      submitText,
      titleText,
    };
  },
  data() {
    return {
      tipoId: '',
      numId: '',
      contrasena: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: '',
      telefono: '',
      ciudad: '',
      direccion: '',
      correo: '',
      disableVar: '',
      titleText: '',
    };
  },
  methods: {
    async OnSumbit() {
      try {
        await this.$axios.$post('pacientes/', {
          tipoId: this.tipoId,
          numId: this.numId,
          nombres: this.nombres,
          apellidos: this.apellidos,
          fechaNacimiento: this.fechaNacimiento,
          ciudad: this.ciudad,
          telefono: this.telefono,
          direccion: this.direccion,
          correo: this.correo,
        });
        this.$notify({
          message: 'Paciente Creado',
          icon: 'fa fa-check',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'success',
        });
        this.$router.replace({ path: '/medical/' });
      } catch (error) {
        const errorMessage = error.response ? error.response.data.error : error.message;
        this.$notify({
          message: `${errorMessage}`,
          icon: 'fa fa-times',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'danger',
        });
      }
    },
    cancel() {
      this.$router.replace({ path: '/medical/pacientes' });
    },
  },
};
</script>

<style>
  .registrar-paciente-card {
    max-width: 500px;
    margin: 0 auto;
  }
</style>
