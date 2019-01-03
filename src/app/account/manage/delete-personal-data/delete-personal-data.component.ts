import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ManageService } from '../manage.service';
import { DeletePersonalData } from '../models/delete-personal-data';

@Component({
  selector: 'app-account-manage-delete-personal-data',
  templateUrl: './delete-personal-data.component.html',
  styleUrls: ['./delete-personal-data.component.scss']
})
export class DeletePersonalDataComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  model: DeletePersonalData;
  errors: Array<string>;
  requirePassword: boolean;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly manageService: ManageService) {
    this.model = new DeletePersonalData();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Delete Personal Data');
    this.requirePassword = this.route.snapshot.data['hasPassword'] as boolean;
    this.manageService.hasPassword.subscribe(
      (hasPassword: boolean) => this.requirePassword = hasPassword);
  }

  deletePersonalData(form: NgForm): void {
    this.errors = new Array<string>();
    if (!form.valid) { return; }
    this.blockUI.start();
    this.manageService.deletePersonalData$(this.model).subscribe(
      () => this.router.navigate(['/Home']),
      (errors: Array<string>) => this.errors = errors,
      () => this.blockUI.stop());
  }
}
