import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ConfirmEmail } from '../models/confirm-email';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  success: string;

  constructor(
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly accountService: AccountService,
    private readonly route: ActivatedRoute,
    private readonly router: Router) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Confirm Email');
    this.blockUI.start();
    this.route.queryParams.pipe(concatMap(
      (params: Params) => {
        const model: ConfirmEmail = {
          code: params['code'],
          userId: params['userId']
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
        })),
        () => this.blockUI.stop());
  }
}
