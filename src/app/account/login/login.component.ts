import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { AccountService } from '../account.service';
import { Login } from './login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends AppComponent {

  model: Login;

  constructor(
    protected readonly titleService: Title,
    private readonly accountService: AccountService,
    private readonly router: Router) {
    super(titleService);
    this.titleService.setTitle('Clarity: Login');
    this.model = new Login();
  }

  login(form: NgForm): void {
    this.errors = new Array<string>();
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
        (errors: Array<string>) => this.errors = errors);
  }
}
