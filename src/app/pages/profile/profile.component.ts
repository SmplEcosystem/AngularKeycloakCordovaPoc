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
    }, 500);
  }

  private async setToken(): Promise<void> {
    try {
      const token = await this.keycloakService.getToken();
      if (token?.length > 0) {
        localStorage.setItem('token', token);
      }
      if (!localStorage.getItem('token')) {
        this.router.navigate(['/home']);
      }
      console.log("🚀 ~ file: profile.component.ts ~ line 16 ~ ProfileComponent ~ ngOnInit ~ token", token);
    } catch (error) {
      console.log("🚀 ~ file: profile.component.ts ~ line 24 ~ ProfileComponent ~ setToken ~ error", error);
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    this.keycloakService.logout('http://localhost:4200/home').then(() => {
      this.router.navigate(['/home']);
    }).catch(error => console.log(error));
  }
}
