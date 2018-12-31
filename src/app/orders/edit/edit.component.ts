import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  Renderer2,
  ViewChild
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
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
const matches = (el, selector: string) => (el.matches || el.msMatchesSelector).call(el, selector);

@Component({
  selector: 'app-orders-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  errors: Array<string>;
  order: Order;
  orderProducts: GridDataResult;
  shippingAddress: Address;
  orderProductsState: State;
  pageable: PagerSettings;
  sortable: SortSettings;

  @ViewChild(GridComponent)
  private grid: GridComponent;
  private editedRowIndex: number;
  private docClickSubscription: any;

  constructor(
    private readonly titleService: Title,
    private readonly renderer: Renderer2,
    private readonly accountService: AccountService,
    private readonly ordersService: OrdersService,
    private readonly orderProductsService: OrderProductsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) {
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
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    this.order = this.route.snapshot.data['order'] as Order;
    this.orderProducts = process(this.order.orderProducts, this.orderProductsState);
    const address = JSON.parse(this.order.shippingAddress) as Address;
    if (address != null && address.formatted != null) {
      this.shippingAddress = address;
    }
  }

  ngOnDestroy(): void {
    this.docClickSubscription();
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
      () => this.router.navigate([`/Orders/Details/${this.order.id}`]),
      (errors: Array<string>) => this.errors = errors);
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

  private onDocumentClick(e: any): void {
    if (this.formGroup && this.formGroup.valid &&
      !matches(e.target, '#orderProductsGrid tbody *, #cancel')) {
      this.saveCurrent();
    }
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    const code = (event.keyCode ? event.keyCode : event.which);
    if (code === 13 && this.formGroup && this.formGroup.valid &&
      matches(event.target, '.k-input')) {
      this.saveCurrent();
    }
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
        () => this.ordersService.details$(this.order.id),
        (_: Object, order: Order) => order))
      .subscribe(
        (order: Order) => {
          this.order = order;
          this.orderProducts = process(this.order.orderProducts, this.orderProductsState);
        },
        (errors: Array<string>) => this.errors = errors);
    this.closeEditor();
  }
}
