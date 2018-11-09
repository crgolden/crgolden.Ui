import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';
import { Login } from './login';

@Component({
  selector: 'app-account-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  model: Login;
  errors: Array<string>;
  returnUrl: string;

  constructor(
    private readonly titleService: Title,
    private readonly accountService: AccountService,
    private readonly route: ActivatedRoute,
    private readonly router: Router) {
    this.model = new Login();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Login');
    this.route.queryParams.subscribe((params: Params) => this.returnUrl = params['returnUrl']);
  }

  login(form: NgForm): void {
    this.errors = new Array<string>();
    if (!form.valid) { return; }
    this.accountService
      .login(this.model)
      .subscribe(
        (response: Login) => {
          if (response.succeeded) {
            if (typeof this.returnUrl === 'string' && this.returnUrl.length > 0) {
              this.router.navigate([this.returnUrl]);
            } else {
              this.router.navigate(['/Home']);
            }
            return;
          }
          if (response.isNotAllowed) {
            this.errors.push(response.message);
            return;
          }
          if (response.requiresTwoFactor) {
            this.router.navigate(['/loginWith2fa']);
            return;
          }
          if (response.isLockedOut) {
            this.router.navigate(['/lockout']);
            return;
          }
        },
        (errors: Array<string>) => this.errors = errors);
  }
}
