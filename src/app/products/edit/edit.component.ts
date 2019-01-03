import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
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

  @BlockUI() blockUI: NgBlockUI;
  errors: Array<string>;
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
    private readonly accountService: AccountService,
    private readonly productsService: ProductsService,
    private readonly productFilesService: ProductFilesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) {
    this.uploadSaveUrl = `${environment.apiUrl}/Images/Upload`;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Edit Product');
    this.product = this.route.snapshot.data['product'] as Product;
    this.setPrimaryImageUri();
  }

  edit(form: NgForm): void {
    this.errors = new Array<string>();
    if (!form.valid) { return; }
    this.blockUI.start();
    this.productsService.edit$(this.product).subscribe(
      () => this.router.navigate([`/Products/Details/${this.product.id}`]),
      (errors: Array<string>) => this.errors = errors,
      () => this.blockUI.stop());
  }

  onSuccess(event: SuccessEvent): void {
    this.errors = new Array<string>();
    if (event.response.body instanceof Array && event.response.body.length > 0) {
      this.blockUI.start();
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
        productFiles.filter(x => !x.uri.includes('thumbnail'))[0].primary = true;
      }
      this.productFilesService.createRange$(productFiles).pipe(concatMap(
        () => this.productsService.details$(this.product.id))).subscribe(
          (product: Product) => {
            this.product = product;
            this.setPrimaryImageUri();
          },
          (errors: Array<string>) => this.errors = errors,
          () => this.blockUI.stop());
    }
  }

  showSave$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');

  private setPrimaryImageUri(): void {
    if (this.product.productFiles.some(x => x.primary)) {
      this.primaryImageUri = this.product.productFiles.find(x => x.primary).uri;
    }
  }
}
