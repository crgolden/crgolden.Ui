import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexResolver } from './index/index.resolver';
import { DetailsResolver } from './details/details.resolver';
import { EditResolver } from './edit/edit.resolver';
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
      orders: IndexResolver,
    }
  },
  {
    path: 'details/:orderId',
    component: DetailsComponent,
    canActivate: [AppLoggedIn],
    resolve: {
      details: DetailsResolver
    }
  },
  {
    path: 'edit/:orderId',
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
export class OrdersRoutingModule { }
