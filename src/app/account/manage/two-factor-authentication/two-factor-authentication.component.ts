import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ManageService } from '../manage.service';
import { TwoFactorAuthentication } from '../models/two-factor-authentication';

@Component({
  selector: 'app-account-manage-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.scss']
})
export class TwoFactorAuthenticationComponent implements OnInit {

  model: TwoFactorAuthentication;
  message: string;
  errors: Array<string>;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly manageService: ManageService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Two-factor authentication (2FA)');
    this.model = this.route.snapshot.data['twoFactorAuthentication'];
  }

  forgetBrowser(): void {
    this.errors = new Array<string>();
    this.manageService
      .forgetTwoFactorClient()
      .subscribe(
        (response: string) => {
          this.message = response;
          this.model.isMachineRemembered = false;
        },
        (errors: Array<string>) => this.errors = errors);
  }
}
