import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { Login } from './login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  error: string;
  model: Login;

  constructor(
    private readonly accountService: AccountService,
    private readonly router: Router) {
    this.model = new Login();
  }

  login(form: NgForm): void {
    if (!form.valid) { return; }
    this.accountService
      .login(this.model)
      .subscribe(
        (res: boolean) => {
          if (!res) { return; }
          const returnUrl = this.accountService.returnUrl;
          this.accountService.returnUrl = undefined;
          if (typeof returnUrl === 'string' && returnUrl.length > 0) {
            this.router.navigate([returnUrl]);
          } else {
            this.router.navigate(['/Home']);
          }
        },
        (error: string) => this.error = error);
  }
}
