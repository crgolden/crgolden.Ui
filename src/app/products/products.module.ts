import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsService } from './products.service';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import { DeleteComponent } from './delete/delete.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    FontAwesomeModule,
    ProductsRoutingModule
  ],
  declarations: [
    IndexComponent,
    CreateComponent,
    DetailsComponent,
    EditComponent,
    DeleteComponent
  ],
  providers: [
    ProductsService
  ]
})
export class ProductsModule {
}
