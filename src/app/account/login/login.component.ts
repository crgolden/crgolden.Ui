import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Params, ActivatedRoute } from '@angular/router';
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
    this.titleService.setTitle('Clarity: Login');
    this.route.queryParams.subscribe((params: Params) => {
       if (params['returnUrl'] != null) {
         window.sessionStorage.setItem('returnUrl', params['returnUrl']);
       }
      this.accountService.signinRedirect();
    });
  }
}
