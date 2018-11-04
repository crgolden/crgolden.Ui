import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {

  isLoggedIn: boolean;

  constructor(
    private readonly router: Router,
    private readonly accountService: AccountService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.accountService.hasToken();
    this.accountService
      .isLoggedIn
      .subscribe((result: boolean) => this.isLoggedIn = result);
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigate(['/Home']);
  }
}
