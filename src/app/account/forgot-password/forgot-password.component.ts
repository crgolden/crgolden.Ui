import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { ForgotPassword } from '../models/forgot-password';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  errors: Array<string>;
  success: string;
  model: ForgotPassword;

  constructor(
    private readonly titleService: Title,
    private readonly accountService: AccountService) {
    this.model = new ForgotPassword();
  }

  forgotPassword(form: NgForm): void {
    this.errors = new Array<string>();
    if (!form.valid) { return; }
    this.accountService
      .forgotPassword(this.model)
      .subscribe(
        (response: string) => this.success = response,
        (errors: Array<string>) => this.errors = errors);
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Forgot Password');
  }
}
