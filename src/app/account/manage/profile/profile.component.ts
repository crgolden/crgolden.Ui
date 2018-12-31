import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { User } from 'oidc-client';
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

  model: Profile;
  message: string;
  errors: Array<string>;

  constructor(
    private readonly titleService: Title,
    private readonly accountService: AccountService,
    private readonly manageService: ManageService) {
    this.model = new Profile();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Profile');
    this.accountService.user$.subscribe((user: User) => this.setProfile(user));
  }

  profile(form: NgForm): void {
    this.errors = new Array<string>();
    if (!form.valid) { return; }
    this.manageService.profile$(this.model).subscribe(
      (profile: Profile) => {
        this.model = profile;
        this.accountService.signinSilent$();
      },
      (errors: Array<string>) => this.errors = errors);
  }

  sendVerificationEmail(): void {
    this.errors = new Array<string>();
    this.manageService.sendVerificationEmail$().subscribe(
      (response: string) => this.message = response,
      (errors: Array<string>) => this.errors = errors);
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
