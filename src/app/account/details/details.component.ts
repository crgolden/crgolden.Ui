import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Account } from '../account';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  account: Account;

  constructor(
    private readonly titleService: Title,
    private readonly accountService: AccountService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Account Details');
    this.accountService.account.subscribe((response: Account) => this.account = response);
  }
}
