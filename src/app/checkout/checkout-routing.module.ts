import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { CheckoutHasCartProducts } from './checkout.has-cart-products';
import { CheckoutResolver } from './checkout.resolver';
import { AppLoggedIn } from '../app.logged-in';

const routes: Routes = [
  {
    path: '',
    component: CheckoutComponent,
    canActivate: [
      AppLoggedIn,
      CheckoutHasCartProducts
    ],
    resolve: {
      checkout: CheckoutResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
