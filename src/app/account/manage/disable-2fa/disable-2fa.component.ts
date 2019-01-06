import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ManageService } from '../manage.service';

@Component({
  selector: 'app-account-manage-disable-2fa',
  templateUrl: './disable-2fa.component.html',
  styleUrls: ['./disable-2fa.component.scss']
})
export class Disable2faComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  message: string;

  constructor(
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly manageService: ManageService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Disable two-factor authentication (2FA)');
  }

  disable2fa(): void {
    this.blockUI.start();
    this.manageService.disable2fa$().subscribe(
      (response: string) => {
        this.message = response;
        this.router.navigate(['/manage/two-factor-authentication']);
      },
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })),
      () => this.blockUI.stop());
  }
}
