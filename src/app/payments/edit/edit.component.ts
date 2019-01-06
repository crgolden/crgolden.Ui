import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
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
  payment: Payment;

  constructor(
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
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
    if (!form.valid) { return; }
    this.blockUI.start();
    this.paymentsService.edit$(this.payment).subscribe(
      () => this.router.navigate([`/payments/details/${this.payment.id}`]).finally(
        () => {
          window.sessionStorage.setItem('success', `${this.payment.name} updated`);
          this.blockUI.stop();
        }),
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })),
      () => this.blockUI.stop());
  }

  showSave$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
}
