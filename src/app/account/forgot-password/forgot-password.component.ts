import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ForgotPassword } from '../models/forgot-password';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  success: string;
  model: ForgotPassword;

  constructor(
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly accountService: AccountService) {
    this.model = new ForgotPassword();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Forgot Password');
  }

  forgotPassword(form: NgForm): void {
    if (!form.valid) { return; }
    this.accountService.forgotPassword$(this.model).subscribe(
      (response: string) => this.success = response,
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }
}
