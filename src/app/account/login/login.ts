import { Account } from '../account';

export class Login {
  email: string;
  password: string;
  rememberMe: boolean;
  message: string;
  succeeded: boolean;
  isLockedOut: boolean;
  requiresTwoFactor: boolean;
  isNotAllowed: boolean;
  account: Account;
}
