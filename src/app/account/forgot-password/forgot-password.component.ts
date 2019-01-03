import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ForgotPassword } from '../models/forgot-password';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  errors: Array<string>;
  success: string;
  model: ForgotPassword;

  constructor(
    private readonly titleService: Title,
    private readonly accountService: AccountService) {
    this.model = new ForgotPassword();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Forgot Password');
  }

  forgotPassword(form: NgForm): void {
    this.errors = new Array<string>();
    if (!form.valid) { return; }
    this.blockUI.start();
    this.accountService.forgotPassword$(this.model).subscribe(
      (response: string) => this.success = response,
      (errors: Array<string>) => this.errors = errors,
      () => this.blockUI.stop());
  }
}
