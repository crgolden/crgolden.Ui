import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-account-logout-success',
  templateUrl: './logout-success.component.html',
  styleUrls: ['./logout-success.component.scss']
})
export class LogoutSuccessComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private readonly titleService: Title,
    private readonly accountService: AccountService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Logout');
    this.blockUI.start();
    this.accountService.signoutRedirectCallback$().finally(() => this.blockUI.stop());
  }
}
