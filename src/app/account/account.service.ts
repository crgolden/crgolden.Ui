import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'oidc-client';
import { AccountController } from '@clarity/oidc-controllers';
import { environment } from '../../environments/environment';
import { ActionType } from '../app.action-type';
import { CartService } from '../cart/cart.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends AccountController {

  user$: BehaviorSubject<User>;

  constructor(
    http: HttpClient,
    private readonly cartService: CartService) {
    super(environment.identityUrl, environment.identityClientId, [
      'openid',
      'profile',
      'email',
      'phone',
      'address',
      'api1',
      'api2.full_access',
      'api2.read_only',
      'roles'
    ], [
      'id_token',
        'token'
      ], http);
    this.user$ = new BehaviorSubject<User>(null);
  }

  setUser(type: ActionType): void {
    switch (type) {
      case ActionType.Load:
      case ActionType.Login:
        combineLatest(this.userManager.getUser(), this.cartService.cart$)
          .subscribe(latest => {
            const [user, cart] = latest;
            this.user$.next(user);
            switch (type) {
              case ActionType.Load:
                if (cart == null || user != null && !user.expired &&
                  cart.userId !== user.profile['sub']) {
                  this.cartService.setCart(type);
                }
                break;
              case ActionType.Login:
                if (cart != null && cart.userId === user.profile['sub']) { return; }
                const returnUrl = window.sessionStorage.getItem('returnUrl') || '/home';
                this.cartService.setCart(type, returnUrl);
                break;
            }
          });
        break;
      case ActionType.Logout:
        this.cartService.setCart(type);
        this.user$.next(null);
        break;
    }
  }

  userIsLoggedIn$ = (): Observable<boolean> => {
    return this.user$.pipe(map(user => user != null && user.expires_at > (Date.now() / 1000)));
  }

  userHasRole$ = (role: string): Observable<boolean> => {
    const roleType = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    return this.user$.pipe(
      map((user: User) => user != null
        ? user.profile[roleType] instanceof Array
        ? user.profile[roleType].includes(role)
        : typeof user.profile[roleType] === 'string'
        ? user.profile[roleType] === role
        : false
        : false));
  }
}

