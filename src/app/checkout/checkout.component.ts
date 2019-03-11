import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { exhaustMap, filter } from 'rxjs/operators';
import { User } from 'oidc-client';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PaymentComponent } from './payment/payment.component';
import { ShippingAddressComponent } from './shipping-address/shipping-address.component';
import { OrdersService } from '../orders/orders.service';
import { OrderProductsService } from '../order-products/order-products.service';
import { PaymentsService } from '../payments/payments.service';
import { CartProductsService } from '../cart-products/cart-products.service';
import { CartProduct, toProduct } from '../cart-products/cart-product';
import { Order } from '../orders/order';
import { OrderProduct } from '../order-products/order-product';
import { Payment } from '../payments/payment';
import { Address } from '../address/address';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  private modalRef: NgbModalRef;
  private cartProducts: CartProduct[];
  private user: User;
  tokenId: string;
  brand: string;
  last4: string;
  shippingAddress: Address;
  formattedShippingAddress: string;
  validShippingAddress: boolean;
  validPayment: boolean;

  constructor(
    private readonly titleService: Title,
    private readonly modalService: NgbModal,
    private readonly toastr: ToastrService,
    private readonly ordersService: OrdersService,
    private readonly orderProductsService: OrderProductsService,
    private readonly paymentsService: PaymentsService,
    private readonly cartProductsService: CartProductsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Checkout');
    this.shippingAddress = this.route.snapshot.data['checkout'][0] as Address;
    this.cartProducts = this.route.snapshot.data['checkout'][1];
    this.validShippingAddress = this.route.snapshot.data['checkout'][2];
    this.user = this.route.snapshot.data['checkout'][3];
    this.setFormattedShippingAddress();
  }

  openShippingAddressModal(): void {
    this.modalRef = this.modalService.open(ShippingAddressComponent, {
      ariaLabelledBy: 'shippingAddressModalTitle'
    });
    this.modalRef.componentInstance['shippingAddress'] = this.shippingAddress;
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
    this.modalRef = this.modalService.open(PaymentComponent, {
      ariaLabelledBy: 'paymentInformationModalTitle'
    });
    this.modalRef.result.then(
      (value: {
        tokenId: string;
        brand: string;
        last4: string,
      }) => {
        if (value != null) {
          this.tokenId = value.tokenId;
          this.brand = value.brand;
          this.last4 = value.last4;
        }
        this.validPayment = this.tokenId != null;
      },
      (reason: any) => {
      });
  }

  checkout(): void {
    if (
      this.cartProducts.length === 0 ||
      this.invalidPayment() ||
      this.invalidShippingAddress()) {
      return;
    }
    if (this.user.expired) {
      this.router.navigate(['/account/login'], {
        queryParams: {
          returnUrl: '/checkout'
        }
      });
    } else {
      this.ordersService
        .create$(new Order(this.total(), this.shippingAddress))
        .pipe(
          filter(order => order != null),
          exhaustMap((order: Order) => combineLatest(
            of(order),
            this.paymentsService.create$(new Payment(order.id, order.total, 'USD', this.tokenId)),
            this.orderProductsService.createRange$(this.orderProducts(order)))))
        .subscribe(
          latest => {
            const [order] = latest;
            this.router.navigate([`/orders/details/${order.id}`])
              .then(() => this.cartProductsService.cartProducts$.next([]));
            window.sessionStorage.setItem('success', `Order #${order.number} created`);
          },
          (errors: string[]) => errors.forEach(error => this.toastr.error(error, null, {
            disableTimeOut: true
          })));
    }
  }

  needsPayment = (): boolean => this.total() > 0;

  needsShippingAddress(): boolean {
    return this.cartProducts.some(cartProduct => !cartProduct.productIsDownload);
  }

  invalidPayment = (): boolean => this.needsPayment && !this.validPayment;

  invalidShippingAddress = (): boolean => this.needsShippingAddress && !this.validShippingAddress;

  total(): number {
    return this.cartProducts
      .map(cartProduct => cartProduct.productUnitPrice * cartProduct.quantity)
      .reduce((previous, current) => previous + current, 0);
  }

  private setFormattedShippingAddress(): void {
    if (this.shippingAddress == null || this.shippingAddress.formatted == null) {
      return;
    }
    this.formattedShippingAddress = this.shippingAddress.formatted.replace(/\r\n/g, '<br />');
  }

  private orderProducts(order: Order): OrderProduct[] {
    return this.cartProducts.map(
      cartProduct => new OrderProduct(order, toProduct(cartProduct), cartProduct.quantity));
  }
}
