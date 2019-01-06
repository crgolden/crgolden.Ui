import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Register } from '../models/register';
import { Address } from '../../address/address';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
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
    } as Register;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Register');
  }

  register(form: NgForm) {
    if (!form.valid) { return; }
    this.blockUI.start();
    this.accountService.register$(this.model).subscribe(
      (response: string) => this.success = response,
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })),
      () => this.blockUI.stop());
  }
}
