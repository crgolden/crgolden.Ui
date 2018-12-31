import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersResolver } from './orders.resolver';
import { OrderResolver } from './order.resolver';
import { IndexComponent } from './index/index.component';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import { AppLoggedIn } from '../app.logged-in';
import { AppIsAdmin } from '../app.is-admin';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    canActivate: [AppLoggedIn],
    resolve: {
      orders: OrdersResolver,
    }
  },
  {
    path: 'Details/:id',
    component: DetailsComponent,
    canActivate: [AppLoggedIn],
    resolve: {
      order: OrderResolver,
    }
  },
  {
    path: 'Edit/:id',
    component: EditComponent,
    canActivate: [AppIsAdmin],
    resolve: {
      order: OrderResolver,
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    OrdersResolver,
    OrderResolver
  ]
})
export class OrdersRoutingModule { }
