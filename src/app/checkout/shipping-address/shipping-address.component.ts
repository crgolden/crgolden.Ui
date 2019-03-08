import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressService } from '../../address/address.service';
import { Address } from '../../address/address';

@Component({
  selector: 'app-checkout-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.scss']
})
export class ShippingAddressComponent {

  shippingAddress: Address;
  unableToValidateShippingAddress: boolean;

  constructor(
    readonly modal: NgbActiveModal,
    private readonly toastr: ToastrService,
    private readonly addressService: AddressService) {
  }

  useAnyway(useAnyway: boolean): void {
    if (useAnyway) {
      this.setFormatted();
      this.modal.close(this.shippingAddress);
    } else {
      this.unableToValidateShippingAddress = false;
    }
  }

  validateShippingAddress(form: NgForm): void {
    if (!form.valid) { return; }
    this.addressService
      .validate(this.shippingAddress)
      .subscribe(
        isValid => {
          if (isValid) {
            this.setFormatted();
            this.modal.close(this.shippingAddress);
          } else {
            this.unableToValidateShippingAddress = true;
          }
        },
        (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
          disableTimeOut: true
        })));
  }

  private setFormatted(): void {
    this.shippingAddress.formatted = `${this.shippingAddress.street_address}<br />` +
      `${this.shippingAddress.locality}<br />` +
      `${this.shippingAddress.region} ${this.shippingAddress.postal_code}<br />` +
      `${this.shippingAddress.country}`;
  }
}
