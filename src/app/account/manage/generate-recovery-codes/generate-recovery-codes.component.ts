import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { GenerateRecoveryCodes } from '@clarity/oidc-models';
import { ManageService } from '../manage.service';

@Component({
  selector: 'app-account-manage-generate-recovery-codes',
  templateUrl: './generate-recovery-codes.component.html',
  styleUrls: ['./generate-recovery-codes.component.scss']
})
export class GenerateRecoveryCodesComponent implements OnInit {

  model: GenerateRecoveryCodes;
  message: string;

  constructor(
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly manageService: ManageService) {
    this.model = {
      recoveryCodes: new Array<string>()
    } as GenerateRecoveryCodes;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Generate two-factor authentication (2FA) recovery codes');
  }

  generateRecoveryCodes(): void {
    this.manageService.generateRecoveryCodes$().subscribe(
      (response: GenerateRecoveryCodes) => this.model = response,
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }
}
