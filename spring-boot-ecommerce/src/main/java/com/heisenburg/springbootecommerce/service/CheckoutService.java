package com.heisenburg.springbootecommerce.service;

import com.heisenburg.springbootecommerce.dto.PaymentInfo;
import com.heisenburg.springbootecommerce.dto.Purchase;
import com.heisenburg.springbootecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;


public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
