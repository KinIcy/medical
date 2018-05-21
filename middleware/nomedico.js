export default function ({ app, redirect }) {
  if (app.$auth.user.scope.indexOf('medico') >= 0) {
    redirect('/medical/agenda/');
  }
}
