import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AccountService } from '../../account/account.service';
import { PaymentsService } from '../payments.service';
import { Payment } from '../payment';

@Component({
  selector: 'app-payments-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  errors: Array<string>;
  payment: Payment;

  constructor(
    private readonly titleService: Title,
    private readonly accountService: AccountService,
    private readonly paymentsService: PaymentsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Edit Payment');
    this.payment = this.route.snapshot.data['payment'] as Payment;
  }

  edit(form: NgForm): void {
    this.errors = new Array<string>();
    if (!form.valid) { return; }
    this.blockUI.start();
    this.paymentsService.edit$(this.payment).subscribe(
      () => this.router.navigate([`/Payments/Details/${this.payment.id}`]),
      (errors: Array<string>) => this.errors = errors,
      () => this.blockUI.stop());
  }

  showSave$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
}
