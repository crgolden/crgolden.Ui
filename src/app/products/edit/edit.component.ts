import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ToastrService } from 'ngx-toastr';
import {
  FileRestrictions,
  RemoveEvent,
  SelectEvent,
  SuccessEvent
} from '@progress/kendo-angular-upload';
import { environment } from '../../../environments/environment';
import { AccountService } from '../../account/account.service';
import { ProductsController } from '../products.controller';
import { ProductFilesController } from '../../product-files/product-files.controller';
import { Product } from '../product';
import { File } from '../../files/file';
import { ProductFile, toFile } from '../../product-files/product-file';

@Component({
  selector: 'app-products-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  product: Product;
  files: File[];
  productFiles: GridDataResult;
  uploadSaveUrl: string;
  uploadRemoveUrl: string;
  uploadTypes: FileRestrictions = {
    allowedExtensions: ['jpg', 'jpeg', 'png', 'gif']
  };

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly accountService: AccountService,
    private readonly productsController: ProductsController,
    private readonly productFilesController: ProductFilesController) {
    this.uploadRemoveUrl = `${environment.apiUrl}/files/remove`;
    this.uploadSaveUrl = `${environment.apiUrl}/files/upload`;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Edit Product');
    this.productFiles = this.route.snapshot.data['edit'][0];
    this.product = this.route.snapshot.data['edit'][1];
    this.files = this.productFiles.data.map(productFile => toFile(productFile));
  }

  edit(form: NgForm): void {
    if (!form.valid) { return; }
    this.productsController.update$(this.product).subscribe(
      () => {
        window.sessionStorage.setItem('success', `${this.product.name} updated`);
        this.router.navigate([`/products/details/${this.product.id}`]);
      },
      (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }

  onSuccess(event: SuccessEvent): void {
    if (event.response.type !== HttpEventType.Response) {
      return;
    }
    if (!event.response.ok) {
      event.preventDefault();
      this.toastr.error('Something went wrong. Please try again later.');
      return;
    }
    if (event.response.body instanceof Array && event.response.body.length > 0) {
      switch (event.operation) {
        case 'upload':
          event.response.body.forEach((file: File) => this.productFilesController
            .create$(new ProductFile(this.product, file, false))
            .subscribe(
              productFile => {
                this.productFiles.data.push(productFile);
                this.toastr.success(`${file.name} added.`);
              },
              (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
                disableTimeOut: true
              }))));
          break;
        case 'remove':
          event.response.body.forEach(keyValuePair => {
            const index = this.productFiles.data.findIndex(x => x.fileId === keyValuePair.value[0]);
            this.productFiles.data.splice(index, 1);
            this.toastr.success(`${keyValuePair.key} removed.`);
          });
          break;
      }
    }
  }

  onSelect(event: SelectEvent): void {
    const errors: string[] = event.files.reduce((previous, current) => {
      if (this.files.some(file => file.name === current.name)) {
        errors.push(`This product already has an image named ${current.name}.`);
      }
      return previous;
    }, []);
    if (errors.length === 0) {
      return;
    }
    event.preventDefault();
    errors.forEach(error => this.toastr.error(error));
  }

  onRemove(event: RemoveEvent): void {
    event.data = {
      keys: event.files.map((file: File) => [file.id])
    };
  }

  showSave$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
}
