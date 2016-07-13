export default class LoginController {
  constructor($location, authentication) {
      'ngInject';

    this.$location = $location;
    this.authentication = authentication;
    this.name = 'Login';

    this.authorize = this.authorize.bind(this);

    this.email = 'nino.cocchiarella@gmail.com';
    this.password = 'pl3rp!@';
  }

  authorize() {
    this.authentication.authorize(this.email, this.password).then((res) => {
        console.log(res);
      this.$location.path('/app/home');
    }, (err) => {
      console.log(err);
    });
  }
}
