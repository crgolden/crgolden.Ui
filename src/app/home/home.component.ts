import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(protected readonly titleService: Title) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('crgolden: Home');
  }
}
