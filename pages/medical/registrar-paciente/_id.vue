<template>
  <div class="content">
    <div class="container-fluid">
      <card class="registrar-paciente-card">
        <h4 slot="header" class="card-title">{{modoEdicion ? 'Actualizar' : 'Registrar'}} Paciente</h4>
        <form @submit.prevent="OnSubmit">
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-user"></i>
              </span>
            </div>
            <input v-model="nombres" type="text" class="form-control" placeholder="Nombres" :readonly="modoEdicion" required>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-user"></i>
              </span>
            </div>
            <input v-model="apellidos" type="text" class="form-control" placeholder="Apellidos" :readonly="modoEdicion" required>
          </div>
            <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <select class="custom-select" v-model="tipoId" :disabled="modoEdicion">
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
            <input v-model="numId" type="text" class="form-control" placeholder="Numero de Identificacion" :readonly="modoEdicion" required>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-calendar-alt"></i>
              </span>
            </div>
            <input v-model="fechaNacimiento" type="date" class="form-control" placeholder="Fecha de Nacimeinto" :readonly="modoEdicion" required>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-phone"></i>
              </span>
            </div>
            <input v-model="telefono" type="text" class="form-control" placeholder="Teléfono" required>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-home"></i>
              </span>
            </div>
            <input v-model="ciudad" type="text" class="form-control" placeholder="Ciudad" required>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-envelope"></i>
              </span>
            </div>
            <input v-model="correo" type="email" class="form-control" placeholder="Correo Electrónico" required>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-home"></i>
              </span>
            </div>
            <input v-model="direccion" type="text" class="form-control" placeholder="Dirección">
          </div>
          <button class="btn btn-primary mr-2" type="submit"> {{ modoEdicion ? 'Actualizar' : 'Registrar' }} Paciente</button>
          <button class="btn btn-secundary" @click="cancel" type="button">Cancelar</button>
        </form>
      </card>
    </div>
  </div>
</template>

<script>
import Card from '~/components/Cards/Card.vue';

function defaultData() {
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
    modoEdicion: false,
  };
}

export default {
  components: { Card },
  async asyncData({ app, params }) {
    let data = {};
    if (params.id) {
      try {
        data = await app.$axios.$get(`pacientes/${params.id}`);
        data.modoEdicion = true;
        return data;
      } catch (error) {
        data.error = error.response ? error.response.data.error : error.message;
      }
    }
    return defaultData();
  },
  data: () => defaultData(),
  methods: {
    OnSubmit() {
      if (this.modoEdicion) {
        this.editarPaciente();
      } else this.registrarPaciente();
    },
    async registrarPaciente() {
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
    async editarPaciente() {
      try {
        await this.$axios.$put(`pacientes/${this.idPaciente}`, {
          ciudad: this.ciudad,
          telefono: this.telefono,
          direccion: this.direccion,
          correo: this.correo,
        });
        this.$notify({
          message: 'Paciente Actualizado',
          icon: 'fa fa-check',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'success',
        });
        this.$router.replace({ path: '/medical/pacientes' });
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
