<template>
  <div class="content">
    <div class="container-fluid">
      <card>
        <h4 slot="header" class="card-title">Médicos</h4>
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
  head: {
    title: 'Medicos ~ Medical',
  },
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
    editarMedico(idMedico) {
      this.$router.replace({ path: `/medical/registrar-medico/${idMedico}` });
    },

  },
};
</script>

<style>
</style>
