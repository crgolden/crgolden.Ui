import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { FileRestrictions, SuccessEvent } from '@progress/kendo-angular-upload';
import { environment } from '../../../environments/environment';
import { AccountService } from '../../account/account.service';
import { ProductsService } from '../products.service';
import { Product } from '../product';
import { File } from '../../files/file';
import { ProductFilesService } from '../../product-files/product-files.service';
import { ProductFile } from '../../product-files/product-file';

@Component({
  selector: 'app-products-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  product: Product;
  images: Array<File>;
  uploadSaveUrl: string;
  uploadRemoveUrl: string;
  uploadTypes: FileRestrictions = {
    allowedExtensions: ['jpg', 'jpeg', 'png', 'gif']
  };
  primaryImageUri: string;

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
    this.product = this.route.snapshot.data['product'] as Product;
    this.setPrimaryImageUri();
  }

  edit(form: NgForm): void {
    if (!form.valid) { return; }
    this.productsService.edit$(this.product).subscribe(
      () => {
        window.sessionStorage.setItem('success', `${this.product.name} updated`);
        this.router.navigate([`/products/details/${this.product.id}`]);
      },
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }

  onSuccess(event: SuccessEvent): void {
    if (event.response.body instanceof Array && event.response.body.length > 0) {
      const productFiles = event.response.body.map((file: any) => {
        return {
          model1Id: this.product.id,
          model1Name: this.product.name,
          model2Id: file['id'],
          model2Name: file['name'],
          created: new Date(file['created']),
          uri: file['uri'],
          contentType: file['contentType']
        } as ProductFile;
      });
      if (!this.primaryImageUri) {
        const imageFiles = productFiles.filter(productFile =>
          productFile.contentType.includes('image') &&
          !productFile.uri.includes('thumbnail'));
        if (imageFiles.length > 0) {
          imageFiles[0].primary = true;
        }
      }
      this.productFilesService.createRange$(productFiles).pipe(concatMap(
        () => this.productsService.details$(this.product.id))).subscribe(
          (product: Product) => {
            this.product = product;
            this.setPrimaryImageUri();
            this.toastr.success('Images(s) added');
          },
          (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
            disableTimeOut: true
          })));
    }
  }

  showSave$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');

  private setPrimaryImageUri(): void {
    if (this.product.productFiles.some(productFile => productFile.primary)) {
      this.primaryImageUri = this.product.productFiles.find(productFile => productFile.primary).uri;
    }
  }
}
