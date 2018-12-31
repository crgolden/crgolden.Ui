import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../../account/account.service';
import { Payment } from '../payment';

@Component({
  selector: 'app-payments-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  errors: Array<string>;
  payment: Payment;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly accountService: AccountService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Payment Details');
    this.payment = this.route.snapshot.data['payment'] as Payment;
  }

  showEdit$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
}
