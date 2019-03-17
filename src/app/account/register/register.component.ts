import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Address } from '@clarity/core-claims';
import { Register } from '@clarity/oidc-models';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  model: Register;
  success: string;

  constructor(
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly accountService: AccountService) {
    this.model = {
      email: undefined,
      firstName: undefined,
      lastName: undefined,
      password: undefined,
      address: new Address(),
    };
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Register');
  }

  register(form: NgForm) {
    if (!form.valid) { return; }
    if (this.model.address.street_address.length === 0 &&
      this.model.address.locality.length === 0 &&
      this.model.address.region.length === 0 &&
      this.model.address.postal_code.length === 0 &&
      this.model.address.country.length === 0) {
      delete this.model.address;
    }
    this.accountService.register$(this.model).subscribe(
      (response: string) => this.success = response,
      (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }
}
