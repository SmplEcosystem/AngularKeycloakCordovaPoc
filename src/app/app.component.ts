import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularKeycloakCordovaPoc';

  public authenticated: boolean = false;

  constructor(private keycloakService: KeycloakService) {}

  ngOnInit() {
    this.checkLogin();
  }

  checkLogin() {
    this.keycloakService.isLoggedIn().then((isLoggedIn) => this.authenticated = isLoggedIn);
  }

  register() {
    this.keycloakService.register().then(() => this.checkLogin());
  }

  login() {
    this.keycloakService.login().then(() => this.checkLogin());
  }

  logout() {
    this.keycloakService.logout().then();
  }
}
