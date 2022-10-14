import { KeycloakService } from "keycloak-angular";
import { v4 as uuidv4 } from 'uuid';
import { KeycloakConfigObject } from "../environments/keycloakconfig";
import { KeycloakModel } from "./model/keycloak-config.model";
declare var cordova: any;

/**
 *
 * @param keycloak keycloack service
 * @returns any
 */
export function initializeKeycloak(keycloak: KeycloakService): any {
  try {
    return () => {
      if (window.cordova === undefined) {
        return initKeycloakForWeb(keycloak)
      } else {
        return document.addEventListener("deviceready", () => {
          console.log("🚀 ~ file: app-init.ts ~ line 6 ~ return ~ cordova", cordova);
          const browser = cordova.InAppBrowser.open(getUrl(), "_blank");
          console.log("🚀 ~ file: app-init.ts ~ line 14 ~ document.addEventListener ~ browser", browser);
          browser.addEventListener('loadstart', (event: any) => {
            console.log("🚀 ~ file: app-init.ts ~ line 15 ~ browser.on ~ event", event);
            if (event.url.indexOf(KeycloakConfigObject.redirectURL) > -1) {
              browser.close();
            }
          });
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
 * @param keycloak keycloack serverice
 * @returns void
 */

async function initKeycloakForWeb(keycloak: KeycloakService): Promise<boolean> {
  try {
    return await keycloak.init({
      config: {
        url: KeycloakConfigObject.url,
        realm: KeycloakConfigObject.realm,
        clientId: KeycloakConfigObject.clientId,
      },
      initOptions: {
        onLoad:'check-sso',
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
