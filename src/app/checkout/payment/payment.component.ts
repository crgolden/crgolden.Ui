import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  private readonly stripe: stripe.Stripe;
  private card: stripe.elements.Element;
  error: stripe.Error;

  constructor(readonly modal: NgbActiveModal) {
    this.stripe = Stripe(`${environment.stripePublishableKey}`, this.stripeOptions());
  }

  ngOnInit(): void {
    this.setCard();
  }

  async validatePaymentInformation(form: NgForm): Promise<void> {
    if (!form.valid || this.error != null) { return; }
    const { token, error } = await this.stripe.createToken(this.card, this.tokenOptions());
    if (error) {
      this.error = error;
    } else {
      this.error = undefined;
      this.modal.close({
        tokenId: token.id,
        brand: token.card.brand,
        last4: token.card.last4
      });
    }
  }

  private setCard(): void {
    const elements = this.stripe.elements(this.elementsOptions());
    const card = elements.create('card', this.cardOptions());
    card.mount('#cardElement');
    card.on('change', (event: stripe.elements.ElementChangeResponse) => {
      if (event.error) {
        this.error = event.error;
      } else {
        this.error = undefined;
      }
    });
    this.card = card;
  }

  private cardOptions(): stripe.elements.ElementsOptions {
    const options: stripe.elements.ElementsOptions = {
      style: {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      }
    };
    return options;
  }

  private elementsOptions(): stripe.elements.ElementsCreateOptions {
    const options: stripe.elements.ElementsCreateOptions = {
    };
    return options;
  }

  private stripeOptions(): stripe.StripeOptions {
    const options: stripe.StripeOptions = {
    };
    return options;
  }

  private tokenOptions(): stripe.TokenOptions {
    const options: stripe.TokenOptions = {
    };
    return options;
  }
}
