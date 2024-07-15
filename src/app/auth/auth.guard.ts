import {Injectable} from "@angular/core";
import {KeycloakAuthGuard, KeycloakService} from "keycloak-angular";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {

  constructor(
    // @ts-ignore
    protected readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }


  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    //force user log in
/*    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      });
    }*/

    //get required roles
    const requiredRoles = route.data['roles'];

    //allow the user to proceed if no need of role
    if (!(requiredRoles instanceof Array || requiredRoles.length === 0))
      return true;

    return requiredRoles.every((role: string) => this.roles.includes(role));
  }
}
