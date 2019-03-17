import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {
  CellClickEvent,
  DataStateChangeEvent,
  GridComponent,
  PagerSettings,
  SortSettings,
  GridDataResult
} from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { Address } from '@clarity/core-claims';
import { AccountService } from '../../account/account.service';
import { OrdersController } from '../orders.controller';
import { Order } from '../order';
import { OrderProductsController } from '../../order-products/order-products.controller';
import { OrderProduct } from '../../order-products/order-product';

const createFormGroup = (orderProduct: OrderProduct): FormGroup => new FormGroup({
  'orderId': new FormControl(orderProduct.orderId),
  'productId': new FormControl(orderProduct.productId),
  'product.name': new FormControl(orderProduct.productName),
  'product.unitPrice': new FormControl(orderProduct.productUnitPrice, Validators.compose([
    Validators.required,
    Validators.min(0)
  ])),
  'quantity': new FormControl(orderProduct.quantity, Validators.compose([
    Validators.required,
    Validators.min(0)
  ])),
  'product.isDownload': new FormControl(orderProduct.productIsDownload)
});

@Component({
  selector: 'app-orders-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  formGroup: FormGroup;
  order: Order;
  orderProducts: GridDataResult;
  shippingAddress: Address;
  orderProductsState: DataSourceRequestState;
  orderProductsPageable: PagerSettings;
  orderProductsSortable: SortSettings;

  @ViewChild(GridComponent)
  private grid: GridComponent;
  private editedRowIndex: number;

  constructor(
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
    private readonly accountService: AccountService,
    private readonly ordersController: OrdersController,
    private readonly orderProductsController: OrderProductsController) {
    this.orderProductsState = orderProductsController.state;
    this.orderProductsPageable = orderProductsController.pageable;
    this.orderProductsSortable = orderProductsController.sortable;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Edit Order');
    this.order = this.route.snapshot.data['edit'][0];
    this.orderProducts = this.route.snapshot.data['edit'][1];
    if (this.order.shippingAddress != null && this.order.shippingAddress.formatted != null) {
      this.shippingAddress = this.order.shippingAddress;
    }
  }

  cancelHandler(): void {
    this.closeEditor();
  }

  edit(form: NgForm): void {
    if (!form.valid) { return; }
    if (this.shippingAddress != null) {
      this.order.shippingAddress = this.shippingAddress;
    }
    this.ordersController.update$(this.order).subscribe(
      () => {
        window.sessionStorage.setItem('success', `Order #${this.order.number} updated`);
        this.router.navigate([`/Orders/Details/${this.order.id}`]);
      },
      (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }

  orderProductsStateChange(state: DataStateChangeEvent): void {
    this.orderProductsState = this.orderProductsController.state = state;
    this.orderProductsController.list$().subscribe(
      result => this.orderProducts = result,
      (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }

  orderProductsClick(event: CellClickEvent): void {
    if (event.isEdited || (this.formGroup && !this.formGroup.valid)) {
      return;
    }
    this.saveCurrent();
    this.formGroup = createFormGroup(event.dataItem);
    this.editedRowIndex = event.rowIndex;
    this.grid.editRow(event.rowIndex, this.formGroup);
  }

  showSave$ = (): Observable<boolean> => this.accountService.userHasRole$('Admin');

  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);

    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  @HostListener('document:keypress', ['$event', '$event.target'])
  handleKeyboardEvent(event: KeyboardEvent, targetElement: HTMLElement): void {
    if (event.key !== 'Enter' ||
      !this.formGroup ||
      !this.formGroup.valid ||
      !targetElement ||
      !targetElement.matches('.k-input')) {
      return;
    }
    this.saveCurrent();
  }

  @HostListener('document:click', ['$event.target'])
  handleClickEvent(targetElement: HTMLElement): void {
    if (!this.formGroup ||
      !this.formGroup.valid ||
      !targetElement ||
      targetElement.matches('#orderProductsGrid tbody *, #cancel')) {
      return;
    }
    this.saveCurrent();
  }

  private saveCurrent(): void {
    if (!this.formGroup) {
      return;
    }
    if (this.formGroup.pristine) {
      this.closeEditor();
      return;
    }
    this.orderProductsController.update$(this.formGroup.value)
      .pipe(concatMap(() => combineLatest(
        this.ordersController.read$([this.order.id]),
        this.orderProductsController.list$())))
      .subscribe(
        latest => {
          const [order, orderProducts] = latest;
          this.order = order;
          this.orderProducts = orderProducts;
          this.toastr.success(`Order #${this.order.number} updated`);
        },
        (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
          disableTimeOut: true
        })));
    this.closeEditor();
  }
}
