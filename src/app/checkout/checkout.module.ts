import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { GridModule } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { SafePipe } from '../app.safe-pipe';
import { CheckoutComponent } from './checkout.component';
import { PaymentComponent } from './payment/payment.component';
import { ShippingAddressComponent } from './shipping-address/shipping-address.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    GridModule,
    FontAwesomeModule,
    CheckoutRoutingModule
  ],
  declarations: [
    CheckoutComponent,
    PaymentComponent,
    ShippingAddressComponent,
    SafePipe
  ],
  entryComponents: [
    PaymentComponent,
    ShippingAddressComponent
  ]
})
export class CheckoutModule {
}
