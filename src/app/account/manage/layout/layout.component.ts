import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { ManageService } from '../manage.service';
import { ExternalLogins } from '../models/external-logins';

@Component({
  selector: 'app-account-manage-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  externalLogins: ExternalLogins;
  hasPassword: boolean;
  showDeletePersonalData: boolean;
  showEnableAuthenticator: boolean;
  showResetAuthenticator: boolean;
  showDisable2fa: boolean;
  showGenerateRecoveryCodes: boolean;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly manageService: ManageService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Account');
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.showDeletePersonalData = event.url === '/Account/Manage/DeletePersonalData';
        this.showEnableAuthenticator = event.url === '/Account/Manage/EnableAuthenticator';
        this.showResetAuthenticator = event.url === '/Account/Manage/ResetAuthenticator';
        this.showDisable2fa = event.url === '/Account/Manage/Disable2fa';
        this.showGenerateRecoveryCodes = event.url === '/Account/Manage/GenerateRecoveryCodes';
      }
    });
    this.hasPassword = this.route.snapshot.data['hasPassword'] as boolean;
    this.externalLogins = this.route.snapshot.data['externalLogins'] as ExternalLogins;
    this.manageService.hasPassword.subscribe(
      (hasPassword: boolean) => this.hasPassword = hasPassword);
    this.manageService.externalLogins.subscribe(
      (externalLogins: ExternalLogins) => this.externalLogins = externalLogins);
  }
}
