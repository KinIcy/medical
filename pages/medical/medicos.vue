<template>
  <div class="content">
    <div class="container-fluid">
      <card>
        <h4 slot="header" class="card-title">Médicos</h4>
          <div class="col-sm-4">
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-id-card"></i>
                </span>
              </div>
              <input v-model="usuario" type="text" class="form-control" placeholder="Usuario">
            </div>
          </div>
          <div class="col-sm-4">
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-id-card"></i>
                </span>
              </div>
              <input v-model="nombresApellidos" type="text" class="form-control" placeholder="Nombres o Apellidos">
            </div>
            <br>
            <button class="btn btn-primary mr-2" @click.prevent="buscar">Buscar médico</button>
          </div>

          <br>
          <div class="table-responsive">
            <table class="table table-hover table-striped">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Nombre</th>
                  <th>Especialidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="myTable">
                <tr v-for="medico in medicos" :key="medico.idMedico">
                    <td>{{ medico.usuario }}</td>
                    <td>{{ `${medico.nombres} ${medico.apellidos}`}}</td>
                    <td>{{ medico.especialidad }}</td>
                    <td>
                      <b-btn title="Ver" variant="secundary" size="sm" class="btn-simple" type="button" @click="verMedico(medico.idMedico)"><i class="fa fa-eye"></i></b-btn>
                      <b-btn title="Editar" variant="primary" size="sm" class="btn-simple" type="button" @click="editarMedico(medico.idMedico)"><i class="fa fa-edit"></i></b-btn>
                      <b-btn title="Deshabilitar" variant="danger" size="sm" class="btn-simple" type="button" @click="deshabilitarMedico(medico.idMedico)"><i class="fa fa-trash"></i></b-btn>
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
      </card>
    </div>
  </div>
</template>

<script>
import Card from '~/components/Cards/Card.vue';

export default {
  layout: 'default',
  components: { Card },
  async asyncData({ app }) {
    const { medicos } = await app.$axios.$get('medicos/');
    return { medicos };
  },
  data: () => ({
    usuario: '',
    nombresApellidos: '',
  }),
  methods: {
    buscar() {
      alert('Para JSON');
    },
    editarMedico(idMedico) {
      this.$router.replace({ path: `/medical/registrar-medico/${idMedico}` });
    },

  },
};
</script>

<style>
</style>
