import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExternalLogins } from '@clarity/oidc-models';
import { ManageService } from '../manage.service';

@Component({
  selector: 'app-account-manage-external-logins',
  templateUrl: './external-logins.component.html',
  styleUrls: ['./external-logins.component.scss']
})
export class ExternalLoginsComponent implements OnInit {

  model: ExternalLogins;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly manageService: ManageService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: External Logins');
    this.model = this.route.snapshot.data['externalLogins'] as ExternalLogins;
    const hasPassword = this.route.snapshot.data['hasPassword'] as boolean;
    if (this.model.currentLogins.length === 0) {
      this.router.navigate(['/account/manage']);
    } else {
      this.model.showRemoveButton = hasPassword || this.model.currentLogins.length > 1;
      this.manageService.hasPassword.subscribe(
        (value: boolean) => this.model.showRemoveButton = value || this.model.currentLogins.length > 1);
    }
  }

  removeLogin(loginProvider: string, providerKey: string): void {
    this.manageService.removeLogin$(loginProvider, providerKey).subscribe(
      (externalLogins: ExternalLogins) => {
        this.model = externalLogins;
        this.manageService.externalLogins.next(externalLogins);
        if (this.model.currentLogins.length === 0) {
          window.sessionStorage.setItem('success', 'All external logins removed');
          this.router.navigate(['/account/manage']);
        } else {
          this.toastr.success(`${loginProvider} removed`);
        }
      },
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }
}
