import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { ShopValidators } from '../../validators/shop-validators';
import { ShopFormService } from '../../service/shop-form.service';
import { CartService } from '../../service/cart.service';
import { CheckoutService } from '../../service/checkout.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { PaymentInfo } from '../../common/payment-info';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, NgFor, NgIf],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creaditCardYears: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  theEmail: string | undefined;

  stripe = Stripe('');

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = '';

  isDisabled: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private shopFormService: ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      this.theEmail = user?.email;
      this.setupStripePaymentForm();
      this.reviewCartDetails();

      this.checkoutFormGroup = new FormGroup({
        customer: this.formBuilder.group({
          firstName: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            ShopValidators.notOnlyWhitespace,
          ]),
          lastName: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            ShopValidators.notOnlyWhitespace,
          ]),
          email: new FormControl(this.theEmail, [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ]),
        }),
        shippingAddress: this.formBuilder.group({
          street: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            ShopValidators.notOnlyWhitespace,
          ]),
          city: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            ShopValidators.notOnlyWhitespace,
          ]),
          state: new FormControl('', [Validators.required]),
          country: new FormControl('', [Validators.required]),
          zipCode: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            ShopValidators.notOnlyWhitespace,
          ]),
        }),
        billingAddress: this.formBuilder.group({
          street: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            ShopValidators.notOnlyWhitespace,
          ]),
          city: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            ShopValidators.notOnlyWhitespace,
          ]),
          state: new FormControl('', [Validators.required]),
          country: new FormControl('', [Validators.required]),
          zipCode: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            ShopValidators.notOnlyWhitespace,
          ]),
        }),
        creditCard: this.formBuilder.group({
          // cardType: new FormControl('', [Validators.required]),
          // nameOnCard: new FormControl('', [
          //   Validators.required,
          //   Validators.minLength(2),
          //   ShopValidators.notOnlyWhitespace,
          // ]),
          // cardNumber: new FormControl('', [
          //   Validators.required,
          //   Validators.pattern('[0-9]{16}'),
          // ]),
          // securityCode: new FormControl('', [
          //   Validators.required,
          //   Validators.pattern('[0-9]{3}'),
          // ]),
          // expirationMonth: [''],
          // expirationYear: [''],
        }),
      });

      // const startMonth: number = new Date().getMonth() + 1;

      // this.shopFormService.getCreditCardMonths(startMonth).subscribe((data) => {
      //   this.creditCardMonths = data;
      // });

      // this.shopFormService.getCreditCardYears().subscribe((data) => {
      //   this.creaditCardYears = data;
      // });

      this.shopFormService.getCountries().subscribe((data) => {
        this.countries = data;
      });
    });
  }
  setupStripePaymentForm() {
    var elements = this.stripe.elements();

    this.cardElement = elements.create('card', { hidePostalCode: true });

    this.cardElement.mount('#card-element');

    this.cardElement.on('change', (event: any) => {
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = '';
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    });
  }

  reviewCartDetails() {
    this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));
    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }
  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }
  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  copyShippingAddressToBillingAddress(event: Event) {
    if ((event.target as HTMLInputElement)?.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    const order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const orderItems: OrderItem[] = this.cartService.cartItems.map(
      (tempCartItem) => new OrderItem(tempCartItem)
    );

    const purchase = new Purchase();
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingAddressState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingAddressCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.state = shippingAddressState.name;
    purchase.shippingAddress.country = shippingAddressCountry.name;

    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;
    const billingAddressState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingAddressCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.state = billingAddressState.name;
    purchase.billingAddress.country = billingAddressCountry.name;

    purchase.order = order;
    purchase.orderItems = orderItems;

    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = 'USD';
    this.paymentInfo.receiptEmail = purchase.customer.email;

    if (
      !this.checkoutFormGroup.invalid &&
      this.displayError.textContent === ''
    ) {
      this.isDisabled = true;
      this.checkoutService
        .createPaymentIntent(this.paymentInfo)
        .subscribe((data) => {
          this.stripe
            .confirmCardPayment(
              data.client_secret,
              {
                payment_method: {
                  card: this.cardElement,
                  billing_details: {
                    email: purchase.customer.email,
                    name:
                      purchase.customer.firstName +
                      ' ' +
                      purchase.customer.lastName,
                    address: {
                      city: purchase.billingAddress.city,
                      country: this.billingAddressCountry?.value.code,
                      line1: purchase.billingAddress.street,
                      postal_code: purchase.billingAddress.zipCode,
                      state: purchase.billingAddress.state,
                    },
                  },
                },
              },
              { handleActions: false }
            )
            .then((result: any) => {
              if (result.error) {
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
              } else {
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(
                      `Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`
                    );

                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error: (error: any) => {
                    alert(`There was an error: ${error.message}`);
                    this.isDisabled = false;
                  },
                });
              }
            });
        });
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl('/products');
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup?.value.expirationYear
    );

    let startMonth: number = 1;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data;
    });
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;

    this.shopFormService.getState(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      formGroup?.get('state')?.setValue(data[0]);
    });
  }
}
