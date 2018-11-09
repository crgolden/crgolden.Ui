import { OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { ConfirmEmail } from './confirm-email';
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
    this.route.queryParams.subscribe((params: Params) => {
      const model: ConfirmEmail = {
        code: params['code'],
        userId: params['userId']
      };
      if (typeof model.userId !== 'undefined' && typeof model.code !== 'undefined') {
        this.accountService
          .confirmEmail(model)
          .subscribe(
            (response: string) => this.success = response,
            (errors: Array<string>) => this.errors = errors);
      } else {
        this.router.navigate(['/Home']);
      }
    });
  }
}
