import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-account-login-callback',
  templateUrl: './login-callback.component.html',
  styleUrls: ['./login-callback.component.scss']
})
export class LoginCallbackComponent implements OnInit {

  constructor(
    private readonly titleService: Title,
    private readonly accountService: AccountService,
    private readonly router: Router) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Login');
    this.accountService.signinRedirectCallback().subscribe(() => {
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
