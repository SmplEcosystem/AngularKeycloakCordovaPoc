import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from 'src/app/services/auth.service';
import { KeycloakConfigObject } from 'src/environments/keycloakconfig';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private keycloakService: KeycloakService, private router: Router, private ngZone: NgZone, private authService: AuthService) { }

  ngOnInit(): void {
    if (window.cordova === undefined) {
      this.ngZone.run(() => {
        this.isTokenValid();
      })
    } else {
      document.addEventListener("deviceready", () => {
        this.ngZone.run(() => {
          this.isTokenValid();
        })
      }, false);
    }
  }

  private async isTokenValid(): Promise<void> {
    const user = await this.authService.getUserInfo();
    console.log("🚀 ~ file: home.component.ts ~ line 33 ~ HomeComponent ~ isTokenValid ~ user", user);
    if (user?.name) {
      this.router.navigate(['/profile']);
    }
  }

  async login(): Promise<void> {
    setTimeout(() => {
      this.keycloakService.login({ prompt: 'login', redirectUri: KeycloakConfigObject.redirectURL }).then(() => {
        this.router.navigate(['/profile']);
      }).catch(error => console.log(error));
    }, 500);
  }
}
