import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
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
    private readonly manageService: ManageService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: External Logins');
    this.model = this.route.snapshot.data['externalLogins'];
  }

  removeLogin(loginProvider: string, providerKey: string): void {
    this.errors = new Array<string>();
    this.manageService
      .removeLogin(loginProvider, providerKey)
      .subscribe(
        (response: ExternalLogins) => this.model = response,
        (errors: Array<string>) => this.errors = errors);
  }

  linkLogin(name: string): void {
    window.location.href = `${environment.identityUrl}/Account/Manage/LinkLogin?provider=${name}`;
  }
}
