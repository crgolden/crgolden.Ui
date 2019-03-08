import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexResolver } from './index/index.resolver';
import { DetailsResolver } from './details/details.resolver';
import { EditResolver } from './edit/edit.resolver';
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
      index: IndexResolver
    }
  },
  {
    path: 'create',
    component: CreateComponent,
    canActivate: [AppIsAdmin]
  },
  {
    path: 'details/:productId',
    component: DetailsComponent,
    resolve: {
      details: DetailsResolver
    }
  },
  {
    path: 'edit/:productId',
    component: EditComponent,
    canActivate: [AppIsAdmin],
    resolve: {
      edit: EditResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
