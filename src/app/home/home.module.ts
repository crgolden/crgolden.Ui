import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHome
} from '@fortawesome/pro-light-svg-icons';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

library.add(
  faHome
);

@NgModule({
  imports: [
    FontAwesomeModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule { }
