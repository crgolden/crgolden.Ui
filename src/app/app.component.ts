import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  errors: Array<string>;

  public constructor(protected readonly titleService: Title) {
  }
}
