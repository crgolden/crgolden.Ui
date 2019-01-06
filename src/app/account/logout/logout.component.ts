import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-account-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private readonly titleService: Title,
    private readonly cookieService: CookieService,
    private readonly accountService: AccountService) {
  }

  ngOnInit(): void {
    this.blockUI.start();
    this.titleService.setTitle('Clarity: Logout');
    this.cookieService.delete('CartId', '/');
    this.accountService.signoutRedirect().finally(() => this.blockUI.stop());
  }
}
