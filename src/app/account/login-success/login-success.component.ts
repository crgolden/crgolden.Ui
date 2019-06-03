import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActionType } from '../../app.action-type';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-account-login-success',
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.scss']
})
export class LoginSuccessComponent implements OnInit {

  constructor(
    private readonly titleService: Title,
    private readonly accountService: AccountService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('crgolden: Login');
    this.accountService.signinRedirectCallback$()
      .then(() => this.accountService.setUser(ActionType.Login));
  }

}
