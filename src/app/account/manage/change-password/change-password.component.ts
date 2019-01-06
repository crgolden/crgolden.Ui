import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ManageService } from '../manage.service';
import { ChangePassword } from '../models/change-password';

@Component({
  selector: 'app-account-manage-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  model: ChangePassword;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly manageService: ManageService) {
    this.model = new ChangePassword();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Change Password');
    const hasPassword = this.route.snapshot.data['hasPassword'] as boolean;
    if (!hasPassword) {
      this.router.navigate(['/account/manage/set-password']);
    } else {
      const message = window.sessionStorage.getItem('success');
      if (message != null) {
        window.sessionStorage.removeItem('success');
        setTimeout(() => this.toastr.success(message));
      }
    }

  }

  changePassword(form: NgForm): void {
    if (!form.valid) { return; }
    this.blockUI.start();
    this.manageService.changePassword$(this.model).subscribe(
      (response: string) => this.toastr.success(response),
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })),
      () => this.blockUI.stop());
  }
}
