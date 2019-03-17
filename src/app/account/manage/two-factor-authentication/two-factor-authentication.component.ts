import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TwoFactorAuthentication } from '@clarity/oidc-models';
import { ManageService } from '../manage.service';

@Component({
  selector: 'app-account-manage-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.scss']
})
export class TwoFactorAuthenticationComponent implements OnInit {

  model: TwoFactorAuthentication;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
    private readonly manageService: ManageService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Two-factor authentication (2FA)');
    this.model = this.route.snapshot.data['twoFactorAuthentication'];
    const message = window.sessionStorage.getItem('success');
    if (message != null) {
      window.sessionStorage.removeItem('success');
      setTimeout(() => this.toastr.success(message));
    }
  }

  forgetBrowser(): void {
    this.manageService.forgetTwoFactorClient$().subscribe(
      (response: string) => {
        this.toastr.success(response);
        this.model.isMachineRemembered = false;
      },
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }
}
