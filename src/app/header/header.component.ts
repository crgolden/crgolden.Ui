import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../account/account';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  account: Account;

  constructor(
    private readonly router: Router,
    private readonly accountService: AccountService) {
  }

  ngOnInit(): void {
    this.accountService.account.subscribe((account: Account) => this.account = account);
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigate(['/Home']);
  }
}
