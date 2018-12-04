import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageService } from '../manage.service';
import { SetPassword } from '../models/set-password';

@Component({
  selector: 'app-account-manage-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {

  model: SetPassword;
  message: string;
  errors: Array<string>;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly manageService: ManageService) {
    this.model = new SetPassword();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Set Password');
    const hasPassword = this.route.snapshot.data['hasPassword'] as boolean;
    if (hasPassword) {
      this.router.navigate(['/Account/Manage/ChangePassword']);
    }
  }

  setPassword(form: NgForm): void {
    this.errors = new Array<string>();
    if (!form.valid) { return; }
    this.manageService
      .setPassword(this.model)
      .subscribe(
        (response: string) => this.message = response,
        (errors: Array<string>) => this.errors = errors);
  }
}
