import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout-payment-stripe',
  templateUrl: './payment-stripe.component.html',
  styleUrls: ['./payment-stripe.component.scss']
})
export class PaymentStripeComponent implements OnInit {

  private readonly stripe: stripe.Stripe;
  private card: stripe.elements.Element;
  error: stripe.Error;

  constructor(private readonly modal: NgbActiveModal) {
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
      this.modal.close(token);
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
          lineHeight: '18px',
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
    }
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
