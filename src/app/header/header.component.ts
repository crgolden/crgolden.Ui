import { Component, OnInit } from '@angular/core';
import { User } from 'oidc-client';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: User;

  constructor(private readonly accountService: AccountService) {
  }

  ngOnInit(): void {
    this.accountService.user.subscribe((user: User) => this.user = user);
  }
}
