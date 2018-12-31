import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ConfirmEmail } from '../models/confirm-email';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  errors: Array<string>;
  success: string;

  constructor(
    private readonly titleService: Title,
    private readonly accountService: AccountService,
    private readonly route: ActivatedRoute,
    private readonly router: Router) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Confirm Email');
    this.route.queryParams.pipe(concatMap(
      (params: Params) => {
        const model: ConfirmEmail = {
          code: params['code'],
          userId: params['userId']
        };
        if (model.userId != null && model.code != null) {
          return this.accountService.confirmEmail$(model);
        } else {
          this.router.navigate(['/Home']);
          return of('');
        }
      },
      (_: Params, response: string) => response)).subscribe(
        (res: string) => this.success = res.length > 0
          ? res
          : undefined,
        (errors: Array<string>) => this.errors = errors);
  }
}
