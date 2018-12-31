import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ManageService } from '../manage.service';

@Component({
  selector: 'app-account-manage-disable-2fa',
  templateUrl: './disable-2fa.component.html',
  styleUrls: ['./disable-2fa.component.scss']
})
export class Disable2faComponent implements OnInit {

  message: string;
  errors: Array<string>;

  constructor(
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly manageService: ManageService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Disable two-factor authentication (2FA)');
  }

  disable2fa(): void {
    this.errors = new Array<string>();
    this.manageService.disable2fa$().subscribe(
      (response: string) => this.router.navigate(['/Manage/TwoFactorAuthentication']),
      (errors: Array<string>) => this.errors = errors);
  }
}
