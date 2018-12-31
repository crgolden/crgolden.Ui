import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { CheckoutCanActivate } from './checkout.can-activate';
import { AddressResolver } from '../address/address.resolver';
import { AppLoggedIn } from '../app.logged-in';

const routes: Routes = [
  {
    path: '',
    component: CreateComponent,
    canActivate: [
      CheckoutCanActivate,
      AppLoggedIn
    ],
    resolve: {
      validAddress: AddressResolver
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
    CheckoutCanActivate,
    AddressResolver
  ]
})
export class CheckoutRoutingModule { }
