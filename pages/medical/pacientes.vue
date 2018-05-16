<template>
  <div class="content">
    <div class="container-fluid">
      <card>
        <h4 slot="header" class="card-title">Pacientes</h4>
        <form class="form-inline">
            <div class="col-sm-4" >
              <div class="input-group mb-2">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fa fa-id-card"></i>
                  </span>
                </div>
                <select class="custom-select" v-model="tipoId">
                  <option value="" selected disabled>Tipo de Identificación</option>
                  <option value="CC">Cedula de Ciudadanía</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="PP">Pasaporte</option>
                  <option value="RC">Registro Civil</option>
                  <option value="CE">Cedula Extranjera</option>
                </select>
              </div>
            </div>

            <div class="col-sm-4">
              <div class="input-group mb-2">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fa fa-id-card"></i>
                  </span>
                </div>
                <input v-model="numId" type="text" class="form-control" placeholder="Número de identificación" required>
              </div>
            </div>
          </form>
            <div class="col-sm-4">
              <div class="input-group mb-2">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fa fa-id-card"></i>
                  </span>
                </div>
                <input v-model="nombresApellidos" type="text" class="form-control" placeholder="Nombres o Apellidos" required>
              </div>
              <br>
              <button class="btn btn-primary mr-2" @click.prevent="buscar">Buscar paciente</button>
            </div>
          <form>

          </form>
          <br>
          <div class="table-responsive">
            <table class="table table-hover table-striped">
              <thead>
                <tr>
                  <th>Identificación</th>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="myTable">
                <tr v-for="paciente in pacientes" :key="paciente.idPaciente">
                    <td>{{ `${paciente.tipoId}${paciente.numId}`}}</td>
                    <td>{{ `${paciente.nombres} ${paciente.apellidos}`}}</td>
                    <td>{{ paciente.telefono }}</td>
                    <td>{{ paciente.correo }}</td>
                    <td>
                      <b-btn title="Ver" variant="secundary" size="sm" class="btn-simple" type="button" @click="verPaciente(paciente.idPaciente)"><i class="fa fa-eye"></i></b-btn>
                      <b-btn title="Editar" variant="primary" size="sm" class="btn-simple" type="button" @click="editarPaciente(paciente.idPaciente)"><i class="fa fa-edit"></i></b-btn>
                      <b-btn title="Deshabilitar" variant="danger" size="sm" class="btn-simple" type="button" @click="deshabilitarPaciente(paciente.idPaciente)"><i class="fa fa-trash"></i></b-btn>
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
    const { pacientes } = await app.$axios.$get('pacientes/');
    return { pacientes };
  },
  data: () => ({
    buscarPorNombre: '',
    nombresApellidos: '',
    numId: '',
    tipoId: '',
  }),
  methods: {
    buscar() {
      alert('Para JSON');
    },

  },
};
</script>

<style>
</style>
