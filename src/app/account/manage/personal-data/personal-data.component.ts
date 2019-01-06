import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { saveAs } from '@progress/kendo-file-saver';
import { ManageService } from '../manage.service';

@Component({
  selector: 'app-account-manage-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.scss']
})
export class PersonalDataComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly manageService: ManageService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Personal Data');
  }

  downloadPersonalData(): void {
    this.blockUI.start();
    this.manageService.downloadPersonalData$().subscribe(
      (response: HttpResponse<Blob>) => saveAs(response.body, 'PersonalData.json'),
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })),
      () => this.blockUI.stop());
  }
}
