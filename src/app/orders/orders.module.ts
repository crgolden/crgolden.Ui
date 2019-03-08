import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrdersRoutingModule } from './orders-routing.module';
import { IndexComponent } from './index/index.component';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    InputsModule,
    LabelModule,
    FontAwesomeModule,
    OrdersRoutingModule
  ],
  declarations: [
    IndexComponent,
    DetailsComponent,
    EditComponent
  ]
})
export class OrdersModule {
}
