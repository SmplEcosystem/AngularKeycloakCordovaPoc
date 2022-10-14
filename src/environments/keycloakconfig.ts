import { KeycloakModel } from "src/app/model/keycloak-config.model";

export const KeycloakConfigObject: KeycloakModel = {
  url: 'http://192.168.1.118:8080/auth',
  realm: 'SmplFinance',
  clientId: 'smpl-angular-client',
  redirectURL: 'http://localhost:4200'
}
