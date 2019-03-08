import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActionType } from '../app.action-type';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-logout-success',
  templateUrl: './logout-success.component.html',
  styleUrls: ['./logout-success.component.scss']
})
export class LogoutSuccessComponent implements OnInit {

  constructor(
    private readonly titleService: Title,
    private readonly accountService: AccountService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Logout');
    this.accountService.signoutRedirectCallback$()
      .then(() => this.accountService.setUser(ActionType.Logout));
  }
}
