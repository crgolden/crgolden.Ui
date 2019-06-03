import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResetPassword } from '@crgolden/oidc-models';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  success: string;
  model: ResetPassword;

  constructor(
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly accountService: AccountService,
    private readonly route: ActivatedRoute) {
    this.model = new ResetPassword();
  }

  ngOnInit(): void {
    this.titleService.setTitle('crgolden: Reset Password');
    this.route.queryParamMap.subscribe(
      (params: Params) => this.model.code = params['code']);
  }

  resetPassword(form: NgForm) {
    if (!form.valid) { return; }
    this.accountService.resetPassword$(this.model).subscribe(
      (response: string) => this.success = response,
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }
}
