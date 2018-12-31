import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { GridModule } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { SafePipe } from '../app.safe-pipe';
import { CreateComponent } from './create/create.component';
import { PaymentStripeComponent } from './payment-stripe/payment-stripe.component';
import { ShippingAddressComponent } from './shipping-address/shipping-address.component';
import { PaymentsService } from '../payments/payments.service';

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
    CreateComponent,
    PaymentStripeComponent,
    ShippingAddressComponent,
    SafePipe
  ],
  providers: [
    PaymentsService
  ],
  entryComponents: [
    PaymentStripeComponent,
    ShippingAddressComponent
  ]
})
export class CheckoutModule {
}
