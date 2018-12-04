import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ManageService } from '../manage.service';

@Component({
  selector: 'app-account-manage-reset-authenticator',
  templateUrl: './reset-authenticator.component.html',
  styleUrls: ['./reset-authenticator.component.scss']
})
export class ResetAuthenticatorComponent implements OnInit {

  message: string;
  errors: Array<string>;

  constructor(
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly manageService: ManageService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Reset authenticator key');
  }

  resetAuthenticator(): void {
    this.errors = new Array<string>();
    this.manageService
      .resetAuthenticator()
      .subscribe(
        (response: string) => this.router.navigate(['/Manage/EnableAuthenticator']),
        (errors: Array<string>) => this.errors = errors);
  }
}
