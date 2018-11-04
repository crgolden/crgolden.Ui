import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { AccountService } from '../account.service'
import { Register } from './register'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends AppComponent {

  model: Register;

  constructor(
    protected readonly titleService: Title,
    private readonly accountService: AccountService,
    private readonly router: Router) {
    super(titleService);
    this.titleService.setTitle('Clarity: Register');
    this.model = new Register();
  }

  register(form: NgForm) {
    this.errors = new Array<string>();
    if (!form.valid) { return; }
    this.accountService
      .register(this.model)
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
