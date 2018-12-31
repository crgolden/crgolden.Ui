import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ManageService } from '../manage.service';
import { GenerateRecoveryCodes } from '../models/generate-recovery-codes';

@Component({
  selector: 'app-account-manage-generate-recovery-codes',
  templateUrl: './generate-recovery-codes.component.html',
  styleUrls: ['./generate-recovery-codes.component.scss']
})
export class GenerateRecoveryCodesComponent implements OnInit {

  model: GenerateRecoveryCodes;
  message: string;
  errors: Array<string>;

  constructor(
    private readonly titleService: Title,
    private readonly manageService: ManageService) {
    this.model = {
      recoveryCodes: new Array<string>()
    } as GenerateRecoveryCodes;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Generate two-factor authentication (2FA) recovery codes');
  }

  generateRecoveryCodes(): void {
    this.errors = new Array<string>();
    this.manageService.generateRecoveryCodes$().subscribe(
      (response: GenerateRecoveryCodes) => this.model = response,
      (errors: Array<string>) => this.errors = errors);
  }
}
