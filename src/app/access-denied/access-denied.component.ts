import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss']
})
export class AccessDeniedComponent implements OnInit {

  constructor(protected readonly titleService: Title) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('crgolden: Access Denied');
  }
}
