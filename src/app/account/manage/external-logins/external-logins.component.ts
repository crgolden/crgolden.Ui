import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ExternalLogins } from '../models/external-logins';
import { ManageService } from '../manage.service';

@Component({
  selector: 'app-account-manage-external-logins',
  templateUrl: './external-logins.component.html',
  styleUrls: ['./external-logins.component.scss']
})
export class ExternalLoginsComponent implements OnInit {

  model: ExternalLogins;
  errors: Array<string>;
  message: string;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly manageService: ManageService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: External Logins');
    this.model = this.route.snapshot.data['externalLogins'] as ExternalLogins;
    const hasPassword = this.route.snapshot.data['hasPassword'] as boolean;
    if (this.model.currentLogins.length === 0) {
      this.router.navigate(['/Account/Manage']);
    } else {
      this.model.showRemoveButton = (hasPassword) || this.model.currentLogins.length > 1;
      this.manageService.hasPassword.subscribe(
        (value: boolean) => this.model.showRemoveButton = value || this.model.currentLogins.length > 1);
    }
  }

  removeLogin(loginProvider: string, providerKey: string): void {
    this.errors = new Array<string>();
    this.manageService.removeLogin$(loginProvider, providerKey).subscribe(
      (externalLogins: ExternalLogins) => {
        this.model = externalLogins;
        this.manageService.externalLogins.next(externalLogins);
        if (this.model.currentLogins.length === 0) {
          this.router.navigate(['/Account/Manage']);
        }
      },
      (errors: Array<string>) => this.errors = errors);
  }
}
