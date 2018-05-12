<template>
  <div class="content">
    <div class="container-fluid">
      <card class="registrar-lista-pacientes-card">
        <h4 slot="header" class="card-title">Lista de pacientes</h4>
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
                </tr>
              </thead>
              <tbody id="myTable">
                <tr v-for="paciente in pacientes">
                    <td style="display:none;">{{ paciente.id }}</td>
                    <td>{{ paciente.tipoId + paciente.numId }}</td>
                    <td>{{ paciente.nombres + ' ' + paciente.apellidos  }}</td>
                    <td>{{ paciente.telefono }}</td>
                    <td>{{ paciente.correo }}</td>

                    <td><a @click.prevent="deshabilitarPaciente(paciente.id)"><i class="fa fa-trash-o text-navy"></i></a></td>
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
  data() {
    return {
      pacientes: [{
        id: '1', tipoId: 'PP', numId: '00000000', nombres: 'Valentin', apellidos: 'Fernandez', telefono: '098409361', correo: 'vafer@mail.com',
      },
      {
        id: '2', tipoId: 'PP', numId: '11111111', nombres: 'Jason', apellidos: 'Lopez', telefono: '555555', correo: 'json@mail.com',
      }],
      buscarPorNombre: '',
      model: {},
    };
  },
  created() {
    this.$axios.$get('pacientes/').then((response) => {
      this.model = response.body;
      console.log(response);
    }).catch((response) => {
      console.log(response);
    });
  },
  methods: {
    buscar() {
      alert('Para JSON');
    },

  },
};
</script>

<style>
  .registrar-lista-pacientes-card {
    margin: 0 auto;
  }
</style>
