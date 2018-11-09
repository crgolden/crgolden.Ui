import { BaseModel } from '../base/base-model';

export class Account extends BaseModel {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  expiration: Date;

  constructor(
    id: string,
    name: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    phoneNumberConfirmed: boolean,
    twoFactorEnabled: boolean,
    expiration: Date) {
    super(id, name);
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.phoneNumberConfirmed = phoneNumberConfirmed;
    this.twoFactorEnabled = twoFactorEnabled;
    this.expiration = expiration;
  }
}
