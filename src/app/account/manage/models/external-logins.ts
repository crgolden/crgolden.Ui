import { UserLoginInfo } from './user-login-info';
import { AuthenticationScheme } from './authentication-scheme';

export class ExternalLogins {
  currentLogins: Array<UserLoginInfo>;
  otherLogins: Array<AuthenticationScheme>;
  showRemoveButton: boolean;
}
