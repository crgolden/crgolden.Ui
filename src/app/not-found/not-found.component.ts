import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(protected readonly titleService: Title) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Not Found');
  }
}
