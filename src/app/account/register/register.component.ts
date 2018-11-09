import { OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from '../account.service';
import { Register } from './register';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  model: Register;
  errors: Array<string>;
  success: string;

  constructor(
    private readonly titleService: Title,
    private readonly accountService: AccountService) {
    this.model = new Register();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Register');
  }

  register(form: NgForm) {
    this.errors = new Array<string>();
    if (!form.valid) { return; }
    this.accountService
      .register(this.model)
      .subscribe(
        (response: string) => this.success = response,
        (errors: Array<string>) => this.errors = errors);
  }
}
