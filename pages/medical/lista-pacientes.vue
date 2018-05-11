<template>
  <div class="content">
    <div class="container-fluid">
      <card class="registrar-lista-pacientes-card">
        <h4 slot="header" class="card-title">Lista de pacientes</h4>
        <form @submit.prevent="OnSumbit">

          <input class="form-control" id="myInput" type="text" placeholder="Search..">
          <br>
          <div class="table-responsive">
            <table class="table table-hover table-striped">
              <thead>
                <tr>
                  <th>Firstname</th>
                  <th>Lastname</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody id="myTable">
                <tr>
                  <td>John</td>
                  <td>Doe</td>
                  <td>john@example.com</td>
                </tr>
                <tr>
                  <td>Mary</td>
                  <td>Moe</td>
                  <td>mary@mail.com</td>
                </tr>
                <tr>
                  <td>July</td>
                  <td>Dooley</td>
                  <td>july@greatstuff.com</td>
                </tr>
                <tr>
                  <td>Anja</td>
                  <td>Ravendale</td>
                  <td>a_r@test.com</td>
                </tr>

              </tbody>
            </table>
          </div>
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
    };
  },
  methods: {
    search() {
      console.log('Hola Mundo');
    },
  },
};
</script>

<style>
  .registrar-lista-pacientes-card {
    margin: 0 auto;
  }
</style>
