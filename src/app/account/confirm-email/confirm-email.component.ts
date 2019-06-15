import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Params, ActivatedRoute, Router, ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ConfirmEmail } from '@crgolden/oidc-models';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  success: string;

  constructor(
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly accountService: AccountService,
    private readonly route: ActivatedRoute,
    private readonly router: Router) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('crgolden: Confirm Email');
    this.route.queryParamMap.pipe(concatMap(
      (params: ParamMap) => {
        const model: ConfirmEmail = {
          code: params.get('code'),
          userId: params.get('userId')
        };
        if (model.userId != null && model.code != null) {
          return this.accountService.confirmEmail$(model);
        } else {
          this.router.navigate(['/home']);
          return of('');
        }
      })).subscribe(
        (message: string) => this.success = message.length > 0
          ? message
          : undefined,
        (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
          disableTimeOut: true
        })));
  }
}
