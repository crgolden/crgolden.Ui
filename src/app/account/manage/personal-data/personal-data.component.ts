import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Title } from '@angular/platform-browser';
import { ManageService } from '../manage.service';

@Component({
  selector: 'app-account-manage-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.scss']
})
export class PersonalDataComponent implements OnInit {

  errors: Array<string>;

  constructor(
    private readonly titleService: Title,
    private readonly manageService: ManageService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Personal Data');
  }

  downloadPersonalData(): void {
    this.errors = new Array<string>();
    this.manageService.downloadPersonalData$().subscribe(
      (response: HttpResponse<Blob>) => saveAs(response.body, 'PersonalData.json'),
      (errors: Array<string>) => this.errors = errors);
  }
}
