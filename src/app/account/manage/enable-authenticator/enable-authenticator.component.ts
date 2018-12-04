import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ManageService } from '../manage.service';
import { EnableAuthenticator } from '../models/enable-authenticator';

@Component({
  selector: 'app-account-manage-enable-authenticator',
  templateUrl: './enable-authenticator.component.html',
  styleUrls: ['./enable-authenticator.component.scss']
})
export class EnableAuthenticatorComponent implements OnInit {

  model: EnableAuthenticator;
  message: string;
  errors: Array<string>;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly manageService: ManageService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Configure authenticator app');
    this.model = this.route.snapshot.data['enableAuthenticator'];
  }

  verifyAuthenticator(form: NgForm): void {
    if (!form.valid) { return; }
    this.errors = new Array<string>();
    this.manageService
      .verifyAuthenticator(this.model)
      .subscribe(
        (response: EnableAuthenticator) => {
          if (response.recoveryCodes && response.recoveryCodes.length > 0) {
            this.model = response;
          } else {
            this.router.navigate(['/Manage/TwoFactorAuthentication']);
          }
        },
        (errors: Array<string>) => this.errors = errors);
  }
}
