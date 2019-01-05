import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AddressService } from '../../address/address.service';
import { Address } from '../../address/address';

@Component({
  selector: 'app-checkout-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.scss']
})
export class ShippingAddressComponent {

  @BlockUI() blockUI: NgBlockUI;
  errors: Array<string>;
  shippingAddress: Address;
  unableToValidateShippingAddress: boolean;

  constructor(
    readonly modal: NgbActiveModal,
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
    this.errors = new Array<string>();
    if (!form.valid) { return; }
    this.blockUI.start();
    this.addressService.validate(this.shippingAddress).subscribe(
      (isValid: boolean) => {
        if (isValid) {
          this.setFormatted();
          this.modal.close(this.shippingAddress);
        } else {
          this.unableToValidateShippingAddress = true;
        }
      },
      (errors: Array<string>) => this.errors = errors,
      () => this.blockUI.stop());
  }

  private setFormatted(): void {
    this.shippingAddress.formatted = `${this.shippingAddress.street_address}<br />` +
      `${this.shippingAddress.locality}<br />` +
      `${this.shippingAddress.region} ${this.shippingAddress.postal_code}<br />` +
      `${this.shippingAddress.country}`;
  }
}
