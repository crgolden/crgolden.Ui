import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends AppComponent {

  constructor(protected readonly titleService: Title) {
    super(titleService);
    this.titleService.setTitle('Clarity: Home');
  }
}
