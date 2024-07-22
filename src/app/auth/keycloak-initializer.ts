import {KeycloakOptions, KeycloakService} from "keycloak-angular";

export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {

  const options: KeycloakOptions = {
    config: {
      url: 'https://login.energomix.ru:8443/auth',
      realm: 'energomix',
      clientId: 'goodware-ui',
    },
    initOptions: {
      onLoad: 'login-required',
              //onLoad: 'check-sso',
              checkLoginIframe: false
    },
    enableBearerInterceptor: true,
    bearerPrefix: 'Bearer',
    bearerExcludedUrls: ['/assets', '/clients/public'],
  };

  return () => keycloak.init(options);
}
