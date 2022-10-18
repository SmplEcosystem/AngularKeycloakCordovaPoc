import { Injectable } from '@angular/core';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { EndPoints } from '../endpoints/endpoints';
import { KeycloakConfigObject } from 'src/environments/keycloakconfig';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private getToken(): any {
    return localStorage.getItem('token');
  }

  async getUserInfo(): Promise<any> {
    try {
      const response = await (await fetch(`${KeycloakConfigObject.url}/realms/${KeycloakConfigObject.realm}${EndPoints.userInfo}`, {
        method: 'GET', headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.getToken(),
        }
      })).json();
      console.log("🚀 ~ file: auth.service.ts ~ line 20 ~ AuthService ~ getUser ~ response", response);
      return response;
    } catch (error) {
      console.log("🚀 ~ file: auth.service.ts ~ line 23 ~ AuthService ~ getUser ~ err", error);
      return false;
    }
  }

}
