import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private keycloakService: KeycloakService, private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.setToken();
    }, 1000);
  }

  private async setToken(): Promise<void> {
    try {
      const token = await this.keycloakService.getToken();
      localStorage.setItem('token', token);
      console.log("🚀 ~ file: profile.component.ts ~ line 16 ~ ProfileComponent ~ ngOnInit ~ token", token);
    } catch (error) {
      console.log("🚀 ~ file: profile.component.ts ~ line 24 ~ ProfileComponent ~ setToken ~ error", error);
    }
  }

  async logout(): Promise<void> {
    this.keycloakService.logout().then(() => this.router.navigate(['/home'])).catch(error => console.log(error));
  }
}
