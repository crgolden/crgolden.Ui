import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';
import { UploadModule } from '@progress/kendo-angular-upload';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductsRoutingModule } from './products-routing.module';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
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
    ScrollViewModule,
    UploadModule,
    FontAwesomeModule,
    ProductsRoutingModule
  ],
  declarations: [
    IndexComponent,
    CreateComponent,
    DetailsComponent,
    EditComponent
  ]
})
export class ProductsModule {
}
