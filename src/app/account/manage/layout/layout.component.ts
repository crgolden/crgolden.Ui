import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
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

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly manageService: ManageService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Account');
    this.hasPassword = this.route.snapshot.data['hasPassword'] as boolean;
    this.externalLogins = this.route.snapshot.data['externalLogins'] as ExternalLogins;
    this.manageService.hasPassword.subscribe(
      (hasPassword: boolean) => this.hasPassword = hasPassword);
    this.manageService.externalLogins.subscribe(
      (externalLogins: ExternalLogins) => this.externalLogins = externalLogins);
  }

  showDeletePersonalData$(): Observable<boolean> {
    return this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url === '/Account/Manage/DeletePersonalData'));
  }

  showEnableAuthenticator$(): Observable<boolean> {
    return this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url === '/Account/Manage/EnableAuthenticator'));
  }

  showResetAuthenticator$(): Observable<boolean> {
    return this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url === '/Account/Manage/ResetAuthenticator'));
  }

  showDisable2fa$(): Observable<boolean> {
    return this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url === '/Account/Manage/Disable2fa'));
  }

  showGenerateRecoveryCodes$(): Observable<boolean> {
    return this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url === '/Account/Manage/GenerateRecoveryCodes'));
  }
}
