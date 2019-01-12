import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ManageService } from '../manage.service';

@Component({
  selector: 'app-account-manage-reset-authenticator',
  templateUrl: './reset-authenticator.component.html',
  styleUrls: ['./reset-authenticator.component.scss']
})
export class ResetAuthenticatorComponent implements OnInit {

  constructor(
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly manageService: ManageService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Reset authenticator key');
  }

  resetAuthenticator(): void {
    this.manageService.resetAuthenticator$().subscribe(
      (response: string) => {
        window.sessionStorage.setItem('success', response);
        this.router.navigate(['/manage/enable-authenticator']);
      },
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }
}
