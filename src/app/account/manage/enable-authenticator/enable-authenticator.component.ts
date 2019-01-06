import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ManageService } from '../manage.service';
import { EnableAuthenticator } from '../models/enable-authenticator';

@Component({
  selector: 'app-account-manage-enable-authenticator',
  templateUrl: './enable-authenticator.component.html',
  styleUrls: ['./enable-authenticator.component.scss']
})
export class EnableAuthenticatorComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  model: EnableAuthenticator;
  message: string;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly manageService: ManageService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Configure authenticator app');
    this.model = this.route.snapshot.data['enableAuthenticator'];
    const message = window.sessionStorage.getItem('success');
    if (message != null) {
      window.sessionStorage.removeItem('success');
      setTimeout(() => this.toastr.success(message));
    }
  }

  verifyAuthenticator(form: NgForm): void {
    if (!form.valid) { return; }
    this.blockUI.start();
    this.manageService.verifyAuthenticator$(this.model).subscribe(
      (response: EnableAuthenticator) => {
        if (response.recoveryCodes && response.recoveryCodes.length > 0) {
          this.toastr.success('Authenticator verified');
          this.model = response;
        } else {
          window.sessionStorage.setItem('success', 'Authenticator verified');
          this.router.navigate(['/manage/two-factor-authentication']);
        }
      },
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })),
      () => this.blockUI.stop());
  }
}
