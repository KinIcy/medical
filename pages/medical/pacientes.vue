<template>
  <div class="content">
    <div class="container-fluid">
      <card>
        <h4 slot="header" class="card-title">Pacientes</h4>
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
                    <b-btn title="Editar" variant="primary" size="sm" class="btn-simple" type="button" @click="editarPaciente(paciente.idPaciente)"><i class="fa fa-edit"></i></b-btn>
                    <b-btn v-if="false" title="Deshabilitar" variant="danger" size="sm" class="btn-simple" type="button" @click="deshabilitarPaciente(paciente.idPaciente)"><i class="fa fa-trash"></i></b-btn>
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
  head: {
    title: 'Pacientes ~ Medical',
  },
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
    editarPaciente(idPaciente) {
      this.$router.replace({ path: `/medical/registrar-paciente/${idPaciente}` });
    },
  },
};
</script>

<style>
</style>
