import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from 'oidc-client';
import { AccountService } from '../account/account.service';
import { OrdersService } from './orders.service';
import { Order } from './order';

@Injectable()
export class OrderResolver implements Resolve<Order> {

  constructor(
    private readonly router: Router,
    private readonly accountService: AccountService,
    private readonly ordersService: OrdersService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order> {
    const id = route.paramMap.get('id');
    return combineLatest(
      this.accountService.user$,
      this.ordersService.details$(id),
      this.accountService.userHasRole$('Admin')).pipe(
        map((latest: [User, Order, boolean]) => {
          const [user, order, isAdmin] = latest;
          if (order == null) {
            this.router.navigate(['/orders']);
            return undefined;
          }
          if (user == null || !order.userId === user.profile['sub'] && !isAdmin) {
            this.router.navigate(['/access-denied']);
            return undefined;
          }
          return order;
        }),
        take(1));
  }
}
