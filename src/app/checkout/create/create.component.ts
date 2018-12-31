import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { NgbModal, NgbModalRef, NgbModalOptions, } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'oidc-client';
import { CookieService } from 'ngx-cookie-service';
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

  errors: Array<string>;
  private modalRef: NgbModalRef;
  order: Order;
  payment: Payment;
  shippingAddress: Address;
  token: stripe.Token;
  formattedShippingAddress: string;
  needsShippingAddress: boolean;
  validShippingAddress: boolean;
  invalidShipping = this.needsShippingAddress && !this.validShippingAddress;
  needsPayment: boolean;
  validPayment: boolean;
  invalidPayment = this.needsPayment && !this.validPayment;

  constructor(
    private readonly titleService: Title,
    private readonly modalService: NgbModal,
    private readonly cookieService: CookieService,
    private readonly accountService: AccountService,
    private readonly cartService: CartService,
    private readonly ordersService: OrdersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router) {
    this.order = {
      id: undefined,
      name: 'Order',
      userId: undefined,
      created: undefined,
      total: 0,
      orderProducts: new Array<OrderProduct>(),
      payments: new Array<Payment>()
    } as Order;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Checkout');
    this.accountService.user$
      .subscribe((user: User) => {
        if (user != null && typeof user.profile['address'] === 'string') {
          const address = JSON.parse(user.profile['address']) as Address;
          this.shippingAddress = address;
          this.setFormattedShippingAddress(address);
        } else {
          this.shippingAddress = new Address();
        }
      });
    this.cartService.cart$
      .subscribe((cart: Cart) => {
        if (cart != null) {
          this.setOrder(cart);
          this.needsShippingAddress = cart.cartProducts.some(x => !x.isDownload);
          this.needsPayment = cart.cartProducts.some(x => x.price > 0);
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
        this.setFormattedShippingAddress(value);
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
    if (this.invalidShipping || this.invalidPayment) { return; }
    if (this.shippingAddress != null) {
      this.order.shippingAddress = JSON.stringify(this.shippingAddress);
    }
    if (this.payment != null) {
      this.order.payments.push(this.payment);
    }
    combineLatest(
      this.ordersService.create$(this.order),
      this.cartService.cart$.pipe(concatMap(
        (cart) => {
          cart.cartProducts = new Array<CartProduct>();
          return this.cartService.edit$(cart);
        },
        (cart) => {
          this.cookieService.delete('CartId');
          this.cartService.cart$.next(cart);
        })))
      .pipe(map(
        (response: [Order, void]) => response[0]))
      .subscribe(
        (order: Order) => this.router.navigate([`/Orders/Details/${order.id}`]),
        (errors: Array<string>) => this.errors = errors);
  }

  private setFormattedShippingAddress(address: Address): void {
    this.formattedShippingAddress = address.formatted.replace(/\r\n/g, '<br />');
  }

  private setOrder(cart: Cart): void {
    this.order.userId = cart.userId;
    this.order.total = cart.total;
    cart.cartProducts.forEach(x => {
      this.order.orderProducts.push({
        model1Id: undefined,
        model1Name: this.order.name,
        model2Id: x.model2Id,
        model2Name: x.model2Name,
        created: undefined,
        quantity: x.quantity,
        isDownload: x.isDownload,
        price: x.price,
        extendedPrice: x.extendedPrice
      } as OrderProduct);
    });
  }

  private setPayment(tokenId: string): void {
    if (tokenId != null) {
      this.payment = {
        id: undefined,
        name: 'Payment',
        userId: this.order.userId,
        amount: this.order.total,
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
