import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from 'oidc-client';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-account-login-callback',
  templateUrl: './login-callback.component.html',
  styleUrls: ['./login-callback.component.scss']
})
export class LoginCallbackComponent implements OnInit {

  errors: Array<string>;

  constructor(
    private readonly titleService: Title,
    private readonly accountService: AccountService,
    private readonly router: Router) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Login');
    this.accountService
      .signinRedirectCallback()
      .then((user: User) => {
        this.accountService.user.next(user);
        const returnUrl = window.sessionStorage.getItem('returnUrl');
        if (returnUrl != null) {
          window.sessionStorage.removeItem('returnUrl');
          this.router.navigate([returnUrl]);
        } else {
          this.router.navigate(['/Home']);
        }
      });
  }
}
