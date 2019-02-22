import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../account/account.service';
import { PaymentsService } from '../payments.service';
import { Payment } from '../payment';

@Component({
  selector: 'app-payments-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  payment: Payment;

  constructor(
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
    private readonly accountService: AccountService,
    private readonly paymentsService: PaymentsService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Edit Payment');
    this.payment = this.route.snapshot.data['payment'] as Payment;
  }

  edit(form: NgForm): void {
    if (!form.valid) { return; }
    this.paymentsService.edit$(this.payment).subscribe(
      () => {
        window.sessionStorage.setItem('success', `Payment #${this.payment.chargeId} updated`);
        this.router.navigate([`/payments/details/${this.payment.id}`]);
      },
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }

  showSave$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
}
