import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartResolver } from './cart.resolver';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path: '',
    component: EditComponent,
    resolve: {
      cart: CartResolver
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
    CartResolver
  ]
})
export class CartRoutingModule { }
