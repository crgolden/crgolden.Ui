import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-account-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private readonly titleService: Title,
    private readonly cookieService: CookieService,
    private readonly accountService: AccountService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Logout');
    this.cookieService.delete('CartId', '/', `${environment.cookieDomain}`);
    this.accountService.signoutRedirect();
  }
}
