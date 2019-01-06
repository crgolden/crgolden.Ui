import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { User } from 'oidc-client';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../account.service';
import { ManageService } from '../manage.service';
import { Profile } from '../models/profile';
import { Address } from '../../../address/address';

@Component({
  selector: 'app-account-manage-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  model: Profile;

  constructor(
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly accountService: AccountService,
    private readonly manageService: ManageService) {
    this.model = new Profile();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Profile');
    this.accountService.user$.subscribe((user: User) => this.setProfile(user));
    const message = window.sessionStorage.getItem('success');
    if (message != null) {
      window.sessionStorage.removeItem('success');
      setTimeout(() => this.toastr.success(message));
    }

  }

  profile(form: NgForm): void {
    if (!form.valid) { return; }
    this.blockUI.start();
    this.manageService.profile$(this.model).subscribe(
      (profile: Profile) => {
        this.toastr.success('Profile updated');
        this.model = profile;
        this.accountService.signinSilent();
      },
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })),
      () => this.blockUI.stop());
  }

  sendVerificationEmail(): void {
    this.blockUI.start();
    this.manageService.sendVerificationEmail$().subscribe(
      (response: string) => this.toastr.success(response),
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })),
      () => this.blockUI.stop());
  }

  private setProfile(user: User): void {
    if (user.profile == null) { return; }
    this.model.email = user.profile['email'];
    this.model.emailConfirmed = user.profile['email_verified'];
    this.model.phoneNumber = user.profile['phone_number'];
    this.model.phoneNumberConfirmed = user.profile['phone_number_verified'];
    this.model.firstName = user.profile['given_name'];
    this.model.lastName = user.profile['family_name'];
    if (user.profile['address'] != null) {
      this.model.address = JSON.parse(user.profile['address']) as Address;
    } else {
      this.model.address = new Address();
    }
  }
}
