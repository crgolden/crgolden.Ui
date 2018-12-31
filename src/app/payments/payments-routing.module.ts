import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentResolver } from './payment.resolver';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import { AppLoggedIn } from '../app.logged-in';
import { AppIsAdmin } from '../app.is-admin';

const routes: Routes = [
  {
    path: 'Details/:id',
    component: DetailsComponent,
    canActivate: [AppLoggedIn],
    resolve: {
      payment: PaymentResolver,
    }
  },
  {
    path: 'Edit/:id',
    component: EditComponent,
    canActivate: [AppIsAdmin],
    resolve: {
      payment: PaymentResolver,
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
    PaymentResolver
  ]
})
export class PaymentsRoutingModule { }
