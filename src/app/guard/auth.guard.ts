import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { KeycloakConfigObject } from 'src/environments/keycloakconfig';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected readonly keycloak: KeycloakService,
    protected readonly route: Router,
  ) {
    super(route, keycloak);
  }
  /**
   *
   * @param route router
   * @returns boolean value
   */
  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
  ): Promise<boolean> {
    console.log("***************authenticated*************", this.authenticated)
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: KeycloakConfigObject.redirectURL
      });
    }

    // Get the roles required from the route.
    console.log('**************** route data******************', route.data)
    const requiredRoles = route.data['roles'];

    // Allow the user to proceed if no additional roles are required to access the route.
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.every((role) => this.roles.includes(role));
  }
}
