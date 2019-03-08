import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ToastrService } from 'ngx-toastr';
import { FileRestrictions, SuccessEvent } from '@progress/kendo-angular-upload';
import { environment } from '../../../environments/environment';
import { AccountService } from '../../account/account.service';
import { ProductsService } from '../products.service';
import { Product } from '../product';
import { ProductFilesService } from '../../product-files/product-files.service';
import { ProductFile, toFile } from '../../product-files/product-file';
import { File } from '../../files/file';

@Component({
  selector: 'app-products-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  product: Product;
  files: File[];
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
    private readonly productsService: ProductsService,
    private readonly productFilesService: ProductFilesService) {
    this.uploadSaveUrl = `${environment.apiUrl}/Images/Upload`;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Edit Product');
    const productFiles: GridDataResult = this.route.snapshot.data['edit'][0];
    this.product = this.route.snapshot.data['edit'][1];
    this.files = productFiles.data.map(productFile => toFile(productFile));
  }

  edit(form: NgForm): void {
    if (!form.valid) { return; }
    this.productsService.edit$(this.product).subscribe(
      () => {
        window.sessionStorage.setItem('success', `${this.product.name} updated`);
        this.router.navigate([`/products/details/${this.product.id}`]);
      },
      (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }

  onSuccess(event: SuccessEvent): void {
    if (event.response.body instanceof Array && event.response.body.length > 0) {
      this.productFilesService
        .createRange$(event.response.body.map(file => (new ProductFile(this.product, file, false))))
        .subscribe(
          productFiles => productFiles
            .map(productFile => toFile(productFile))
            .forEach(file => {
              this.files.push(file);
              this.toastr.success(`${file.name} added`);
            }),
          (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
            disableTimeOut: true
          })));
    }
  }

  showSave$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');
}
