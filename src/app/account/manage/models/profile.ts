import { Address } from '../../../address/address';

export class Profile {
  emailConfirmed: boolean;
  email: string;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  firstName?: string;
  lastName?: string;
  address?: Address;
}
