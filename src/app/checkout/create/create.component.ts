import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { concatMap, exhaustMap, filter, map, mergeMap } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal, NgbModalRef, NgbModalOptions, } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'oidc-client';
import { PaymentStripeComponent } from '../payment-stripe/payment-stripe.component';
import { ShippingAddressComponent } from '../shipping-address/shipping-address.component';
import { AccountService } from '../../account/account.service';
import { CartService } from '../../cart/cart.service';
import { OrdersService } from '../../orders/orders.service';
import { Cart } from '../../cart/cart';
import { CartProduct } from '../../cart-products/cart-product';
import { Order } from '../../orders/order';
import { OrderProduct } from '../../order-products/order-product';
import { Payment } from '../../payments/payment';
import { Address } from '../../address/address';

@Component({
  selector: 'app-checkout-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  errors: Array<string>;
  private modalRef: NgbModalRef;
  payment: Payment;
  shippingAddress: Address;
  token: stripe.Token;
  formattedShippingAddress: string;
  validShippingAddress: boolean;
  validPayment: boolean;

  constructor(
    private readonly titleService: Title,
    private readonly modalService: NgbModal,
    private readonly accountService: AccountService,
    private readonly cartService: CartService,
    private readonly ordersService: OrdersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Checkout');
    this.accountService.user$.subscribe(
      (user: User) => {
        if (user != null && typeof user.profile['address'] === 'string') {
          this.shippingAddress = JSON.parse(user.profile['address']) as Address;
          this.setFormattedShippingAddress();
        } else {
          this.shippingAddress = new Address();
        }
      });
    this.validShippingAddress = this.route.snapshot.data['validAddress'];
  }

  openShippingAddressModal(): void {
    const options: NgbModalOptions = {
      ariaLabelledBy: 'shippingAddressModalTitle'
    };
    this.modalRef = this.modalService.open(ShippingAddressComponent, options);
    this.modalRef.componentInstance.shippingAddress = this.shippingAddress;
    this.modalRef.result.then(
      (value: Address) => {
        this.validShippingAddress = true;
        this.shippingAddress = value;
        this.setFormattedShippingAddress();
      },
      (reason: any) => {
      });
  }

  openPaymentInformationModal(): void {
    const options: NgbModalOptions = {
      ariaLabelledBy: 'paymentInformationModalTitle'
    };
    this.modalRef = this.modalService.open(PaymentStripeComponent, options);
    this.modalRef.result.then(
      (value: stripe.Token) => {
        this.token = value;
        this.setPayment(value.id);
      },
      (reason: any) => {
      });
  }

  create(): void {
    this.cartService.cart$
      .pipe(
        filter((cart: Cart) => cart.cartProducts.length > 0 &&
          (cart.total === 0 || this.validPayment) &&
          (!cart.cartProducts.some(x => !x.isDownload) || this.validShippingAddress)),
        exhaustMap(
          (cart: Cart) => {
            const order: Order = {
              id: undefined,
              name: 'Order',
              created: undefined,
              userId: cart.userId,
              total: cart.total,
              orderProducts: cart.cartProducts.map(x => {
                return {
                  model1Id: undefined,
                  model1Name: 'Order',
                  model2Id: x.model2Id,
                  model2Name: x.model2Name,
                  price: x.price,
                  quantity: x.quantity,
                  created: undefined,
                  isDownload: x.isDownload,
                } as OrderProduct;
              }),
              payments: new Array<Payment>()
            };
            cart.cartProducts = new Array<CartProduct>();
            if (this.shippingAddress != null) {
              order.shippingAddress = JSON.stringify(this.shippingAddress);
            }
            if (this.payment != null) {
              this.payment.userId = order.userId;
              this.payment.amount = order.total;
              order.payments.push(this.payment);
            }
            this.errors = new Array<string>();
            this.blockUI.start();
            return this.ordersService.create$(order).pipe(mergeMap(
              (newOrder: Order) => this.cartService.edit$(cart).pipe(concatMap(
                () => this.cartService.details$(cart.id).pipe(map(
                  (updatedCart: Cart) => {
                    this.cartService.cart$.next(updatedCart);
                    return newOrder;
                  }))))));
          }))
      .subscribe(
        (order: Order) => this.router.navigate([`/orders/details/${order.id}`]).finally(
          () => this.blockUI.stop()),
        (errors: Array<string>) => this.errors = errors,
        () => this.blockUI.stop());
  }

  needsPayment$(): Observable<boolean> {
    return this.cartService.cart$.pipe(map(
      (cart: Cart) => cart != null && cart.total > 0));
  }

  needsShippingAddress$(): Observable<boolean> {
    return this.cartService.cart$.pipe(map(
      (cart: Cart) => cart != null &&
        cart.cartProducts != null &&
        cart.cartProducts.some(x => !x.isDownload)));
  }

  invalidPayment$(): Observable<boolean> {
    return this.needsPayment$().pipe(map(
      (response: boolean) => response && !this.validPayment));
  }

  invalidShippingAddress$(): Observable<boolean> {
    return this.needsShippingAddress$().pipe(map(
      (response: boolean) => response && !this.validShippingAddress));
  }

  total$(): Observable<number> {
    return this.cartService.cart$.pipe(
      filter((cart: Cart) => cart != null),
      map((cart: Cart) => cart.total));
  }

  private setFormattedShippingAddress(): void {
    if (this.shippingAddress.formatted == null) {
      return;
    }
    this.formattedShippingAddress = this.shippingAddress.formatted.replace(/\r\n/g, '<br />');
  }

  private setPayment(tokenId: string): void {
    if (tokenId != null) {
      this.payment = {
        id: undefined,
        name: 'Payment',
        userId: undefined,
        amount: undefined,
        currency: 'USD',
        description: 'Example Description',
        tokenId: tokenId,
        created: undefined
      } as Payment;
      this.validPayment = true;
    } else {
      this.validPayment = false;
    }
  }
}
