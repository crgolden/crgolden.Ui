import { ComponentFixture } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { QueryHelpers } from '../../test/helpers/query-helpers';

export class DetailsPage {

  fixture: ComponentFixture<DetailsComponent>;

  constructor(fixture: ComponentFixture<DetailsComponent>) {
    this.fixture = fixture;
  }

  get firstName() {
    let firstName = QueryHelpers.query<HTMLDivElement>(this.fixture, '#accountFirstName').textContent;
    if (typeof firstName === 'string') {
      firstName = firstName.trim();
    }
    return firstName;
  }

  get lastName() {
    let lastName = QueryHelpers.query<HTMLDivElement>(this.fixture, '#accountLastName').textContent;
    if (typeof lastName === 'string') {
      lastName = lastName.trim();
    }
    return lastName;
  }

  get email() {
    let email = QueryHelpers.query<HTMLDivElement>(this.fixture, '#accountEmail').textContent;
    if (typeof email === 'string') {
      email = email.trim();
    }
    return email;
  }

  get phoneNumber() {
    const phoneNumberElement = QueryHelpers.query<HTMLDivElement>(this.fixture, '#accountPhoneNumber');
    if (phoneNumberElement != null) {
      let phoneNumber = phoneNumberElement.textContent;
      if (typeof phoneNumber === 'string') {
        phoneNumber = phoneNumber.trim();
      }
      return phoneNumber;
    }
    return undefined;
  }

  get phoneNumberConfirmed() {
    let phoneNumberConfirmed = QueryHelpers.query<HTMLDivElement>(this.fixture, '#accountPhoneNumberConfirmed').textContent;
    if (typeof phoneNumberConfirmed === 'string') {
      phoneNumberConfirmed = phoneNumberConfirmed.trim();
    }
    return phoneNumberConfirmed;
  }

  get twoFactorEnabled() {
    let twoFactorEnabled = QueryHelpers.query<HTMLDivElement>(this.fixture, '#accountTwoFactorEnabled').textContent;
    if (typeof twoFactorEnabled === 'string') {
      twoFactorEnabled = twoFactorEnabled.trim();
    }
    return twoFactorEnabled;
  }
}
