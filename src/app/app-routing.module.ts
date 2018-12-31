import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

const routes: Routes = [
  {
    path: 'Home',
    component: HomeComponent
  },
  {
    path: 'AccessDenied',
    component: AccessDeniedComponent
  },
  {
    path: 'Account',
    loadChildren: './account/account.module#AccountModule'
  },
  {
    path: 'Payments',
    loadChildren: './payments/payments.module#PaymentsModule'
  },
  {
    path: 'Products',
    loadChildren: './products/products.module#ProductsModule'
  },
  {
    path: 'Orders',
    loadChildren: './orders/orders.module#OrdersModule'
  },
  {
    path: 'Cart',
    loadChildren: './cart/cart.module#CartModule'
  },
  {
    path: 'Checkout',
    loadChildren: './checkout/checkout.module#CheckoutModule'
  },
  {
    path: '',
    redirectTo: 'Home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'Home'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
