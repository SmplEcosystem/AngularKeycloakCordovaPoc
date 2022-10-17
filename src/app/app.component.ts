import { Component, NgZone } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakConfigObject } from 'src/environments/keycloakconfig';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularKeycloakCordovaPoc';
  public authenticated: boolean = false;

  constructor(private keycloakService: KeycloakService, private ngZone: NgZone) { }

  ngOnInit() {
    if (window.cordova === undefined) {
      this.checkLogin();
    } else {
      document.addEventListener("deviceready", () => {
        setTimeout(() => {
          this.ngZone.run(() => {
            this.checkLogin();
          });
        })
      }, false);
    }
  }

  async checkLogin() {
    const isLoggedIn = await this.keycloakService.isLoggedIn();
    this.authenticated = isLoggedIn;
    console.log("🚀 ~ file: app.component.ts ~ line 23 ~ AppComponent ~ checkLogin ~ isLoggedIn", isLoggedIn);
    if (!this.authenticated) {
      this.login();
    }
  }

  async register() {
    this.keycloakService.register().then(() => this.checkLogin()).catch(error => console.log(error));;
  }

  async login() {
    this.keycloakService.login({ redirectUri: KeycloakConfigObject.redirectURL }).then(() => this.checkLogin()).catch(error => console.log(error));
  }

  async logout() {
    this.keycloakService.logout().then(() => this.checkLogin().catch(error => console.log(error)));
  }
}
