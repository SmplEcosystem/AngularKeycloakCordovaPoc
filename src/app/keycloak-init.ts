import { KeycloakService } from "keycloak-angular";
import { v4 as uuidv4 } from 'uuid';
import { KeycloakConfigObject } from "../environments/keycloakconfig";
import { KeycloakModel } from "./model/keycloak-config.model";

/**
 *
 * @param keycloak keycloack service
 * @returns any
 */
export function initializeKeycloak(keycloak: KeycloakService): any {
  try {
    return () => {
      if (window.cordova === undefined) {
        return initKeycloak(keycloak);
      } else {
        return document.addEventListener("deviceready", () => {
          return initKeycloak(keycloak);
        }, false);
      }
    }
  } catch (err) {
    console.log("🚀 ~ file: app-init.ts ~ line 33 ~ initializeKeycloak ~ err", err);
  }
}


/**
 *
 * @returns url for inappbrowser
 */
function getUrl(): string {
  const config = KeycloakConfigObject;
  const state = encodeURIComponent(uuidv4())
  const nonce = encodeURIComponent(uuidv4());
  const responseMode = encodeURIComponent('fragment');
  const responseType = encodeURIComponent('code');
  const scope = encodeURIComponent('openid');
  return `${getRealmUrl(config)}?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectURL)}&state=${state}&response_mode=${responseMode}&response_type=${responseType}&scope=${scope}&nonce=${nonce}`
}

/**
 *
 * @param config keycloack object
 * @returns realm url
 */
function getRealmUrl(config: KeycloakModel): string {
  return `${config.url}/realms/${config.realm}/protocol/openid-connect/auth`;
}

/**
 *
 * @param keycloak keycloack service
 * @returns void
 */

async function initKeycloak(keycloak: KeycloakService): Promise<boolean> {
  try {
    return await keycloak.init({
      config: {
        url: KeycloakConfigObject.url,
        realm: KeycloakConfigObject.realm,
        clientId: KeycloakConfigObject.clientId,
      },
      initOptions: {
        adapter: window.cordova === undefined ? 'default' : 'cordova',
        checkLoginIframe: false,
        redirectUri: KeycloakConfigObject.redirectURL,
        pkceMethod: 'S256'
      },
    });
  } catch (err) {
    console.log("🚀 ~ file: app-init.ts ~ line 81 ~ initKeycloakForWeb ~ err", err);
    return false;
  }
}
