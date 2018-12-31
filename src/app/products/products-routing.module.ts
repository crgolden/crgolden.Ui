import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsResolver } from './products.resolver';
import { ProductResolver } from './product.resolver';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import { AppIsAdmin } from '../app.is-admin';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    resolve: {
      products: ProductsResolver,
    }
  },
  {
    path: 'Create',
    component: CreateComponent,
    canActivate: [AppIsAdmin]
  },
  {
    path: 'Details/:id',
    component: DetailsComponent,
    resolve: {
      product: ProductResolver,
    }
  },
  {
    path: 'Edit/:id',
    component: EditComponent,
    canActivate: [AppIsAdmin],
    resolve: {
      product: ProductResolver,
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
    ProductsResolver,
    ProductResolver
  ]
})
export class ProductsRoutingModule { }
