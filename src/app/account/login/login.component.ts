import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-account-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private readonly titleService: Title,
    private readonly accountService: AccountService,
    private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('crgolden: Login');
    this.route.queryParamMap.subscribe(params => {
      const returnUrl = params.get('returnUrl');
      if (returnUrl != null) {
        window.sessionStorage.setItem('returnUrl', returnUrl);
      }
      this.accountService.signinRedirect();
    });
  }
}
