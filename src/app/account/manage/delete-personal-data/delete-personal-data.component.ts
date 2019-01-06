import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  requirePassword: boolean;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService,
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
    if (!form.valid) { return; }
    this.blockUI.start();
    this.manageService.deletePersonalData$(this.model).subscribe(
      () => this.router.navigate(['/home']).finally(() => this.blockUI.stop()),
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })),
      () => this.blockUI.stop());
  }
}
