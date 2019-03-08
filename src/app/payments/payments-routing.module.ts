import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsResolver } from './details/details.resolver';
import { EditResolver } from './edit/edit.resolver';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import { AppLoggedIn } from '../app.logged-in';
import { AppIsAdmin } from '../app.is-admin';

const routes: Routes = [
  {
    path: 'details/:paymentId',
    component: DetailsComponent,
    canActivate: [AppLoggedIn],
    resolve: {
      payment: DetailsResolver,
    }
  },
  {
    path: 'edit/:paymentId',
    component: EditComponent,
    canActivate: [AppIsAdmin],
    resolve: {
      payment: EditResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
