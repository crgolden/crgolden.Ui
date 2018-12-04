import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageService } from '../manage.service';
import { ChangePassword } from '../models/change-password';

@Component({
  selector: 'app-account-manage-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  model: ChangePassword;
  message: string;
  errors: Array<string>;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly manageService: ManageService) {
    this.model = new ChangePassword();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Change Password');
    const hasPassword = this.route.snapshot.data['hasPassword'] as boolean;
    if (!hasPassword) {
      this.router.navigate(['/Account/Manage/SetPassword']);
    }
  }

  changePassword(form: NgForm): void {
    this.errors = new Array<string>();
    if (!form.valid) { return; }
    this.manageService
      .changePassword(this.model)
      .subscribe(
        (response: string) => this.message = response,
        (errors: Array<string>) => this.errors = errors);
  }
}
