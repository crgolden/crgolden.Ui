import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
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
import {
  AggregateDescriptor,
  SortDescriptor,
  State,
  process
} from '@progress/kendo-data-query';
import { AccountService } from '../../account/account.service';
import { OrdersService } from '../orders.service';
import { Order } from '../order';
import { OrderProductsService } from '../../order-products/order-products.service';
import { OrderProduct } from '../../order-products/order-product';
import { Address } from '../../address/address';

const createFormGroup = (orderProduct: OrderProduct): FormGroup => new FormGroup({
  'model1Id': new FormControl(orderProduct.model1Id),
  'model1Name': new FormControl(orderProduct.model1Name),
  'model2Id': new FormControl(orderProduct.model2Id),
  'model2Name': new FormControl(orderProduct.model2Name),
  'price': new FormControl(orderProduct.price, Validators.compose([
    Validators.required,
    Validators.min(0)
  ])),
  'quantity': new FormControl(orderProduct.quantity, Validators.compose([
    Validators.required,
    Validators.min(0)
  ])),
  'isDownload': new FormControl(orderProduct.isDownload)
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
  orderProductsState: State;
  pageable: PagerSettings;
  sortable: SortSettings;

  @ViewChild(GridComponent)
  private grid: GridComponent;
  private editedRowIndex: number;

  constructor(
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
    private readonly accountService: AccountService,
    private readonly ordersService: OrdersService,
    private readonly orderProductsService: OrderProductsService) {
    this.orderProductsState = {
      skip: 0,
      take: 5,
      sort: new Array<SortDescriptor>({
        field: 'model2Name',
        dir: 'asc'
      }),
      aggregates: new Array<AggregateDescriptor>()
    } as State;
    this.pageable = {
      buttonCount: 1,
      type: 'numeric',
      info: false,
      previousNext: true
    } as PagerSettings;
    this.sortable = {
      allowUnsort: false,
      mode: 'single'
    } as SortSettings;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Edit Order');
    this.order = this.route.snapshot.data['order'] as Order;
    this.orderProducts = process(this.order.orderProducts, this.orderProductsState);
    const address = JSON.parse(this.order.shippingAddress) as Address;
    if (address != null && address.formatted != null) {
      this.shippingAddress = address;
    }
  }

  cancelHandler(): void {
    this.closeEditor();
  }

  edit(form: NgForm): void {
    if (!form.valid) { return; }
    if (this.shippingAddress != null) {
      this.order.shippingAddress = JSON.stringify(this.shippingAddress);
    }
    this.ordersService.edit$(this.order).subscribe(
      () => {
        window.sessionStorage.setItem('success', `${this.order.name} updated`);
        this.router.navigate([`/Orders/Details/${this.order.id}`]);
      },
      (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
        disableTimeOut: true
      })));
  }

  orderProductsStateChange(state: DataStateChangeEvent): void {
    this.orderProductsState = state;
    this.orderProducts = process(this.order.orderProducts, this.orderProductsState);
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
    this.orderProductsService.edit$(this.formGroup.value)
      .pipe(concatMap(
        () => this.ordersService.details$(this.order.id)))
      .subscribe(
        (order: Order) => {
          this.order = order;
          this.orderProducts = process(this.order.orderProducts, this.orderProductsState);
          window.sessionStorage.setItem('success', `${this.order.name} updated`);
        },
        (errors: Array<string>) => errors.forEach(error => this.toastr.error(error, null, {
          disableTimeOut: true
        })));
    this.closeEditor();
  }
}
