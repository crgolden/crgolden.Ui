import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ManageService } from '../manage.service';
import { SetPassword } from '../models/set-password';

@Component({
  selector: 'app-account-manage-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  model: SetPassword;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly manageService: ManageService) {
    this.model = new SetPassword();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Set Password');
    const hasPassword = this.route.snapshot.data['hasPassword'] as boolean;
    if (hasPassword) {
      this.router.navigate(['/account/manage/change-password']);
    }
  }

  setPassword(form: NgForm): void {
    if (!form.valid) { return; }
    this.blockUI.start();
    this.manageService.setPassword$(this.model).subscribe(
      (response: string) => {
        window.sessionStorage.setItem('success', response);
        this.manageService.hasPassword.next(true);
        this.router.navigate(['/account/manage/change-password']).finally(
          () => this.blockUI.stop());
      },
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })),
      () => this.blockUI.stop());
  }
}
