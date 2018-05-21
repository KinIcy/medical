export default function ({ app, redirect }) {
  if (app.$auth.user.scope.indexOf('paciente') >= 0) {
    redirect('/medical/citas/');
  }
}
